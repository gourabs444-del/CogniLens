const COGNILENS_AUTH_KEY = "cognilensSignedUp";
const COGNILENS_USER_KEY = "cognilensUser";
const COGNILENS_RESULT_KEY = "cognilensResult";
const COGNILENS_HISTORY_KEY = "cognilensResultHistory";
const COGNILENS_SETTING_PREFIX = "cognilensSetting:";

function getCogniLensSetting(key, fallback = true) {
  try {
    const value = window.localStorage?.getItem(`${COGNILENS_SETTING_PREFIX}${key}`);
    if (value === null || value === undefined) return fallback;
    return value === "true";
  } catch (error) {
    return fallback;
  }
}

function setCogniLensSetting(key, enabled) {
  try {
    window.localStorage?.setItem(`${COGNILENS_SETTING_PREFIX}${key}`, enabled ? "true" : "false");
  } catch (error) {
    console.warn("Setting could not be saved:", error);
  }
}

function markCogniLensSignedUp(user = {}) {
  localStorage.setItem(COGNILENS_AUTH_KEY, "true");
  if (user && Object.keys(user).length) {
    localStorage.setItem(COGNILENS_USER_KEY, JSON.stringify({
      uid: user.uid || "",
      name: user.name || user.displayName || "Explorer",
      email: user.email || "",
      provider: user.provider || "email",
      photoURL: user.photoURL || user.picture || "",
      updatedAt: new Date().toISOString()
    }));
  }
}

function hasCogniLensSignedUp() {
  return localStorage.getItem(COGNILENS_AUTH_KEY) === "true";
}

function getCogniLensUser() {
  try {
    return JSON.parse(localStorage.getItem(COGNILENS_USER_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function isCogniLensAuthenticated() {
  const user = getCogniLensUser();
  return hasCogniLensSignedUp() && Boolean(user.uid || user.email);
}

function syncCogniLensAuthUI() {
  const authenticated = isCogniLensAuthenticated();

  document.querySelectorAll("[data-auth-account-section]").forEach((section) => {
    section.hidden = !authenticated;
  });

  document.querySelectorAll("[data-logout-button]").forEach((button) => {
    button.hidden = !authenticated;
    button.disabled = !authenticated;
  });
}

function watchCogniLensFirebaseSession() {
  if (window.__cogniLensAuthWatcherStarted) return;
  window.__cogniLensAuthWatcherStarted = true;

  if (!window.firebase?.auth) {
    syncCogniLensAuthUI();
    return;
  }

  try {
    if (window.firebase.initializeApp && window.COGNILENS_APP_CONFIG?.firebase && !window.firebase.apps.length) {
      window.firebase.initializeApp(window.COGNILENS_APP_CONFIG.firebase);
    }

    window.firebase.auth().onAuthStateChanged((user) => {
      if (user?.uid) {
        markCogniLensSignedUp({
          uid: user.uid,
          name: user.displayName || getCogniLensUser().name || "Explorer",
          email: user.email || "",
          provider: user.providerData?.[0]?.providerId || "firebase",
          photoURL: user.photoURL || ""
        });
      } else if (hasCogniLensSignedUp()) {
        clearCogniLensSession();
      }
      syncCogniLensAuthUI();
    });
  } catch (error) {
    console.warn("Auth UI session check skipped:", error);
    syncCogniLensAuthUI();
  }
}

function getCogniLensUserKey() {
  const user = getCogniLensUser();
  return user.uid || user.email || "local";
}

function readCogniLensHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(COGNILENS_HISTORY_KEY)) || [];
    return Array.isArray(history) ? history : [];
  } catch (error) {
    return [];
  }
}

function saveCogniLensResult(result) {
  const user = getCogniLensUser();
  const savedAt = new Date().toISOString();
  const savedResult = {
    ...result,
    savedAt,
    historyId: result.historyId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userKey: user.uid || user.email || "local",
    userName: user.name || "",
    userEmail: user.email || ""
  };

  localStorage.setItem(COGNILENS_RESULT_KEY, JSON.stringify(savedResult));

  if (getCogniLensSetting("saveHistory", true)) {
    const history = readCogniLensHistory();
    const nextHistory = [
      savedResult,
      ...history.filter((item) => item.historyId !== savedResult.historyId)
    ].slice(0, 60);
    localStorage.setItem(COGNILENS_HISTORY_KEY, JSON.stringify(nextHistory));
  }
}

function setCurrentCogniLensResult(result) {
  if (!result) return;
  localStorage.setItem(COGNILENS_RESULT_KEY, JSON.stringify(result));
}

function getCogniLensResult() {
  try {
    return JSON.parse(localStorage.getItem(COGNILENS_RESULT_KEY)) || null;
  } catch (error) {
    return null;
  }
}

function getCogniLensHistory() {
  const userKey = getCogniLensUserKey();
  const history = readCogniLensHistory();
  const visible = history.filter((item) => !item.userKey || item.userKey === userKey);
  const current = getCogniLensResult();

  if (current && !visible.some((item) => item.historyId === current.historyId || item.savedAt === current.savedAt)) {
    return [current, ...visible];
  }

  return visible;
}

function clearCogniLensHistory() {
  const userKey = getCogniLensUserKey();
  const history = readCogniLensHistory();
  const remaining = history.filter((item) => item.userKey && item.userKey !== userKey);
  localStorage.setItem(COGNILENS_HISTORY_KEY, JSON.stringify(remaining));
}

function clearCogniLensSession() {
  localStorage.removeItem(COGNILENS_AUTH_KEY);
  localStorage.removeItem(COGNILENS_USER_KEY);
}

async function logoutCogniLens(redirectUrl = "") {
  try {
    if (window.firebase?.initializeApp && window.COGNILENS_APP_CONFIG?.firebase) {
      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(window.COGNILENS_APP_CONFIG.firebase);
      }
    }

    if (window.firebase?.auth) {
      await window.firebase.auth().signOut();
    }
  } catch (error) {
    console.warn("Firebase sign-out skipped:", error);
  } finally {
    clearCogniLensSession();
    localStorage.removeItem(COGNILENS_RESULT_KEY);
    localStorage.removeItem("cognilensShareReady");
    localStorage.removeItem("cognilensProfileLink");
    sessionStorage.removeItem("cognilensAuthRedirectPending");
    sessionStorage.removeItem("cognilensAuthRedirectStartedAt");
    sessionStorage.removeItem("cognilensAuthModePending");

    if (redirectUrl) {
      window.location.replace(redirectUrl);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  syncCogniLensAuthUI();
  watchCogniLensFirebaseSession();
});
