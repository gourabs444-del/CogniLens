(function () {
  const BLANK_TOTALS = { I: 0, E: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };

  function collectDimensionTotals() {
    return { ...BLANK_TOTALS };
  }

  function collectBehavioralTraits() {
    return {
      scores: {},
      strongest: [],
      coverage: 0,
      summary: "Behavior scoring algorithm is not configured."
    };
  }

  function buildResult(answers = []) {
    if (window.CogniLensAPI?.submitTest) {
      return window.CogniLensAPI.submitTest({ testType: "mbti", answers });
    }

    const totals = collectDimensionTotals(answers);
    const score = typeof window.getPersonalityResult === "function"
      ? window.getPersonalityResult(totals)
      : { type: "UNCL", confidence: 0, breakdown: {}, warning: "Scoring algorithm is not configured." };
    const metrics = typeof window.getPersonalityMetrics === "function"
      ? window.getPersonalityMetrics(totals)
      : { I: 50, N: 50, T: 50, J: 50 };
    const title = typeof window.getPersonalityTitle === "function"
      ? window.getPersonalityTitle(score.type)
      : "Scoring Algorithm Pending";

    return {
      type: "UNCL",
      confidence: 0,
      honesty: null,
      breakdown: score.breakdown || {},
      warning: score.warning || "Scoring algorithm is not configured.",
      metrics,
      totals,
      answers,
      title,
      behavioralTraits: collectBehavioralTraits(answers),
      source: "local",
      summary: "MBTI questions and scoring logic are currently blank. Add the new scoring algorithm to generate results.",
      tags: ["Scoring pending"]
    };
  }

  function getApiBaseUrl() {
    const fromWindow = window.COGNILENS_API_BASE_URL;
    const fromStorage = (() => {
      try {
        return window.localStorage?.getItem("cognilensApiBaseUrl");
      } catch (error) {
        return "";
      }
    })();
    return String(fromWindow || fromStorage || "http://localhost:8000").replace(/\/+$/, "");
  }

  function normalizeBackendResult(result, answers, fallbackResult) {
    return {
      ...fallbackResult,
      ...result,
      answers,
      source: result.source || "backend",
      backendUrl: getApiBaseUrl()
    };
  }

  async function analyzeWithBackend(answers = [], fallbackResult = buildResult(answers)) {
    const response = await fetch(`${getApiBaseUrl()}/api/mbti/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(body || `Backend analysis failed with HTTP ${response.status}.`);
    }

    const result = await response.json();
    return normalizeBackendResult(result, answers, fallbackResult);
  }

  window.CogniLensCollector = {
    collectDimensionTotals,
    collectBehavioralTraits,
    buildResult,
    analyzeWithBackend
  };
})();
