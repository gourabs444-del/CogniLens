import { cognitiveFunctions, typeTitles } from "../data/traits.js";
import { buildPotentialProfile } from "../engine/potentialEngine.js";

function strongestTraits(traits = {}, definitions = {}) {
  return Object.entries(traits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([key, score]) => ({
      key,
      label: definitions[key]?.label || key,
      value: Math.round(score),
      score: Math.round(score),
      category: definitions[key]?.category || "trait"
    }));
}

function visibleTraitScores(traits = {}) {
  const functionSet = new Set(cognitiveFunctions);
  return Object.fromEntries(
    Object.entries(traits).filter(([key, value]) => !functionSet.has(key) && Number(value) > 0)
  );
}

function compatibilityTags(mbti, confidence, topTraits = []) {
  return [
    mbti?.topType || "Profile",
    `${confidence?.score || 0}% confidence`,
    ...topTraits.slice(0, 3).map((trait) => trait.label)
  ];
}

export function generateReport({ testType = "mbti", answers = [], traitResult, mbti, eq, contradiction, confidence, reasoning, traitDefinitions = {} } = {}) {
  const normalizedTraits = traitResult?.normalized || {};
  const customTraits = traitResult?.customTraits || {};
  const reportTraits = { ...normalizedTraits, ...customTraits };
  const visibleTraits = visibleTraitScores(reportTraits);
  const topCustomTraits = strongestTraits(visibleTraits, traitDefinitions);
  const topType = mbti?.topType || "UNCL";
  const title = typeTitles[topType] || `${topType} Personality Profile`;
  const summary = reasoning?.summary || "Profile generated from weighted answer signals.";

  const report = {
    mbti: mbti?.probabilities || {},
    traits: visibleTraits,
    eq: eq?.scores || {},
    contradictions: contradiction?.contradictions || [],
    confidence,
    reasoning: reasoning?.traits || {},

    meta: {
      testType,
      source: "local-esm-engine",
      answersUsed: traitResult?.answersUsed || 0,
      totalQuestions: traitResult?.totalQuestions || 0,
      coverage: traitResult?.coverage || 0,
      generatedAt: new Date().toISOString(),
      disclaimer: "CogniLens is a personality inference and tendency analysis system, not a clinical diagnosis tool."
    },

    type: topType,
    title,
    summary,
    confidenceScore: confidence?.score || 0,
    modelConfidence: confidence?.score || 0,
    consistency: contradiction?.consistencyScore ?? confidence?.consistencyScore ?? 100,
    contradiction: contradiction?.severity || 0,
    contradictionSummary: contradiction,
    contradictionList: (contradiction?.contradictions || []).map((item) => item.description),
    metrics: mbti?.metrics || { I: 50, N: 50, T: 50, J: 50 },
    totals: mbti?.dimensions || {},
    breakdown: mbti?.probabilities || {},
    cognitiveFunctions: mbti?.functions || {},
    functionScores: mbti?.functions || {},
    functionRatios: mbti?.functionRatios || {},
    finalMbtiScores: mbti?.finalMbtiScores || {},
    traitScores: traitResult?.normalized || {},
    topTraits: testType === "eq" ? eq?.topTraits || [] : topCustomTraits,
    reasonTrail: traitResult?.reasonTrail || [],
    answers,
    answeredCount: traitResult?.answeredCount || 0,
    totalQuestions: traitResult?.totalQuestions || 0,
    missing: traitResult?.missingQuestionIds || [],
    tags: compatibilityTags(mbti, confidence, topCustomTraits),
    algorithm: {
      method: "Weighted option-to-trait matrix with MBTI, EQ, contradiction, confidence, and reasoning engines.",
      directLabeling: false
    },
    source: "local-esm-engine"
  };

  const potential = buildPotentialProfile(report);
  const enrichedReport = {
    ...report,
    potential,
    scope: potential?.scope || null,
    advantage: potential?.strengths || [],
    growthRisks: potential?.risks || [],
    next30Days: potential?.growthPlan || []
  };

  if (testType === "eq") {
    return {
      ...enrichedReport,
      type: eq?.profileType || "Balanced EQ Profile",
      profileType: eq?.profileType || "Balanced EQ Profile",
      moralType: eq?.profileType || "Balanced EQ Profile",
      attachmentStyle: eq?.attachmentStyle,
      moralScores: eq?.moralScores || {},
      raw: traitResult?.raw || {},
      behavioralTraits: eq?.behavioralTraits || [],
      dominantTrait: eq?.topTraits?.[0]?.key || "balanced",
      dominantTraitLabel: eq?.topTraits?.[0]?.label || "Balanced",
      score: contradiction?.consistencyScore ?? 100,
      flag: "Weighted EQ profile generated from answer tendencies."
    };
  }

  return {
    ...enrichedReport,
    behavioralTraits: {
      scores: visibleTraits,
      strongest: topCustomTraits,
      coverage: traitResult?.coverage || 0,
      summary: topCustomTraits.map((trait) => `${trait.label} ${trait.score}%`).join(", ")
    }
  };
}

export function installReportGlobals(target = globalThis) {
  target.CogniLensAPI = {
    ...(target.CogniLensAPI || {}),
    generateReport
  };
}

if (typeof window !== "undefined") installReportGlobals(window);
