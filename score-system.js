/*
 * CogniLens scoring engine
 * Input: raw MBTI dimension scores
 * Output: type, confidence, and dimension breakdown
 */

const COGNILENS_TYPE_TITLES = {
  ISTJ: "Practical Systems Guardian",
  ISFJ: "Supportive Detail Keeper",
  INFJ: "Insightful Purpose Builder",
  INTJ: "Strategic Systems Thinker",
  ISTP: "Precise Tactical Solver",
  ISFP: "Grounded Creative Observer",
  INFP: "Reflective Values Explorer",
  INTP: "Analytical Pattern Architect",
  ESTP: "Action-Oriented Problem Mover",
  ESFP: "Expressive Experience Driver",
  ENFP: "Possibility-Focused Connector",
  ENTP: "Inventive Challenge Solver",
  ESTJ: "Structured Execution Leader",
  ESFJ: "Collaborative Support Organizer",
  ENFJ: "People-Centered Vision Guide",
  ENTJ: "Decisive Strategy Builder"
};

const COGNILENS_ASSESSMENT_TYPES = {
  mbti: {
    id: "mbti",
    name: "MBTI Test",
    status: "ready",
    resultKey: "personality",
    path: "pages/Assets/question.html",
    scoring: "mbti-dimensions",
    description: ""
  },
  iq: {
    id: "iq",
    name: "IQ Test",
    status: "coming-soon",
    resultKey: "iq",
    path: "pages/Assets/iq.html",
    scoring: "pending-question-set",
    description: ""
  },
  eq: {
    id: "eq",
    name: "EQ Test",
    status: "ready",
    resultKey: "eq",
    path: "pages/Assets/eq.html",
    scoring: "pending-question-set",
    description: ""
  }
};

function normalizeScoreValue(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
}

function normalizePersonalityScores(scores = {}) {
  return {
    E: normalizeScoreValue(scores.E),
    I: normalizeScoreValue(scores.I),
    S: normalizeScoreValue(scores.S),
    N: normalizeScoreValue(scores.N),
    T: normalizeScoreValue(scores.T),
    F: normalizeScoreValue(scores.F),
    J: normalizeScoreValue(scores.J),
    P: normalizeScoreValue(scores.P)
  };
}

function getPersonalityResult(scores = {}) {
  const cleanScores = normalizePersonalityScores(scores);
  const safe = (a, b) => cleanScores[a] - cleanScores[b];

  const EI = safe("E", "I") > 0 ? "E" : "I";
  const SN = safe("S", "N") > 0 ? "S" : "N";
  const TF = safe("T", "F") > 0 ? "T" : "F";
  const JP = safe("J", "P") > 0 ? "J" : "P";

  const type = EI + SN + TF + JP;

  const diffEI = Math.abs(cleanScores.E - cleanScores.I);
  const diffSN = Math.abs(cleanScores.S - cleanScores.N);
  const diffTF = Math.abs(cleanScores.T - cleanScores.F);
  const diffJP = Math.abs(cleanScores.J - cleanScores.P);
  const totalDiff = diffEI + diffSN + diffTF + diffJP;
  const confidence = Math.min(95, Math.round(totalDiff * 2));

  const warning = diffEI < 3 || diffSN < 3 || diffTF < 3 || diffJP < 3
    ? "Low clarity in one or more personality dimensions"
    : null;

  return {
    type,
    confidence,
    breakdown: {
      EI: { E: cleanScores.E, I: cleanScores.I },
      SN: { S: cleanScores.S, N: cleanScores.N },
      TF: { T: cleanScores.T, F: cleanScores.F },
      JP: { J: cleanScores.J, P: cleanScores.P }
    },
    warning
  };
}

function getPersonalityMetrics(scores = {}) {
  const cleanScores = normalizePersonalityScores(scores);
  const percentage = (left, right) => {
    const total = cleanScores[left] + cleanScores[right];
    if (!total) return 50;
    return Math.round((cleanScores[left] / total) * 100);
  };

  return {
    I: percentage("I", "E"),
    N: percentage("N", "S"),
    T: percentage("T", "F"),
    J: percentage("J", "P")
  };
}

function getPersonalityTypeFromMetrics(metrics = {}) {
  const value = (key) => {
    const numeric = Number(metrics[key]);
    return Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : 50;
  };

  return `${value("I") >= 50 ? "I" : "E"}${value("N") >= 50 ? "N" : "S"}${value("T") >= 50 ? "T" : "F"}${value("J") >= 50 ? "J" : "P"}`;
}

function getPersonalityTitle(type) {
  return COGNILENS_TYPE_TITLES[type] || `${type || "Adaptive"} Personality Profile`;
}

function getCogniLensAssessmentType(type = "mbti") {
  return COGNILENS_ASSESSMENT_TYPES[type] || COGNILENS_ASSESSMENT_TYPES.mbti;
}

window.COGNILENS_TYPE_TITLES = COGNILENS_TYPE_TITLES;
window.COGNILENS_ASSESSMENT_TYPES = COGNILENS_ASSESSMENT_TYPES;
window.getPersonalityResult = getPersonalityResult;
window.getPersonalityMetrics = getPersonalityMetrics;
window.getPersonalityTypeFromMetrics = getPersonalityTypeFromMetrics;
window.getPersonalityTitle = getPersonalityTitle;
window.getCogniLensAssessmentType = getCogniLensAssessmentType;
