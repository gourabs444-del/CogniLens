/*
 * CogniLens scoring placeholder
 * The previous MBTI scoring logic has been intentionally cleared.
 * Plug the new scoring algorithm into these public functions.
 */

const COGNILENS_TYPE_TITLES = window.CogniLensData?.typeTitles || {
  INTJ: "Strategic Visionary",
  INTP: "Analytical Architect",
  ENTJ: "Commanding Strategist",
  ENTP: "Inventive Challenger",
  INFJ: "Insightful Advocate",
  INFP: "Inner-Values Idealist",
  ENFJ: "People-Centered Guide",
  ENFP: "Possibility Catalyst",
  ISTJ: "Structured Realist",
  ISFJ: "Steady Protector",
  ESTJ: "Practical Organizer",
  ESFJ: "Supportive Harmonizer",
  ISTP: "Tactical Problem Solver",
  ISFP: "Sensitive Individualist",
  ESTP: "Adaptive Operator",
  ESFP: "Expressive Experiencer",
  UNCL: "Inconclusive Profile"
};

const COGNILENS_ASSESSMENT_TYPES = {
  mbti: {
    id: "mbti",
    name: "MBTI Test",
    status: "draft",
    resultKey: "personality",
    path: "pages/Assets/question.html",
    scoring: "pending-algorithm",
    description: ""
  },
  iq: {
    id: "iq",
    name: "IQ Test",
    status: "ready",
    resultKey: "iq",
    path: "pages/Assets/iq.html",
    scoring: "api-reviewed-answer-check",
    description: "Logic, numeric, sequence, and riddle answers with final API review."
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

function normalizePersonalityScores() {
  return { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
}

function getPersonalityResult(totals = {}) {
  const metrics = getPersonalityMetrics(totals);
  const type = getPersonalityTypeFromMetrics(metrics);
  return {
    type,
    confidence: Number(totals.confidence || totals.modelConfidence || 0),
    breakdown: totals.probabilities || totals.breakdown || {},
    warning: type === "UNCL" ? "Not enough scoring data." : ""
  };
}

function getPersonalityMetrics(totals = {}) {
  if (totals.metrics) return totals.metrics;
  const pair = (left, right) => {
    const l = Math.max(0, Number(left) || 0);
    const r = Math.max(0, Number(right) || 0);
    return l + r ? Math.round((l / (l + r)) * 100) : 50;
  };
  return {
    I: Number.isFinite(Number(totals.I)) ? pair(totals.I, totals.E) : 50,
    N: Number.isFinite(Number(totals.N)) ? pair(totals.N, totals.S) : 50,
    T: Number.isFinite(Number(totals.T)) ? pair(totals.T, totals.F) : 50,
    J: Number.isFinite(Number(totals.J)) ? pair(totals.J, totals.P) : 50
  };
}

function getPersonalityTypeFromMetrics(metrics = {}) {
  if (!metrics || Object.keys(metrics).length === 0) return "UNCL";
  const values = ["I", "N", "T", "J"].map((key) => Math.round(Number(metrics[key]) || 50));
  if (values.every((value) => value === 50)) return "UNCL";
  return `${Number(metrics.I) >= 50 ? "I" : "E"}${Number(metrics.N) >= 50 ? "N" : "S"}${Number(metrics.T) >= 50 ? "T" : "F"}${Number(metrics.J) >= 50 ? "J" : "P"}`;
}

function getPersonalityTitle(type) {
  return COGNILENS_TYPE_TITLES[type] || COGNILENS_TYPE_TITLES.UNCL;
}

function getCogniLensAssessmentType(type = "mbti") {
  return COGNILENS_ASSESSMENT_TYPES[type] || COGNILENS_ASSESSMENT_TYPES.mbti;
}

window.COGNILENS_TYPE_TITLES = COGNILENS_TYPE_TITLES;
window.COGNILENS_ASSESSMENT_TYPES = COGNILENS_ASSESSMENT_TYPES;
window.normalizePersonalityScores = normalizePersonalityScores;
window.getPersonalityResult = getPersonalityResult;
window.getPersonalityMetrics = getPersonalityMetrics;
window.getPersonalityTypeFromMetrics = getPersonalityTypeFromMetrics;
window.getPersonalityTitle = getPersonalityTitle;
window.getCogniLensAssessmentType = getCogniLensAssessmentType;
