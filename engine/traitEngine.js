import { cognitiveFunctions, traitDefinitions } from "../data/traits.js";
import { getMapping, mappingsByQuestionId } from "../data/mappings.js";
import { getQuestionSet, parseAnswers } from "../utils/answerParser.js";
import { clamp, normalizePositive, round, topScores } from "../utils/scoreNormalizer.js";

export const CUSTOM_TRAIT_COMPOSITES = Object.freeze({
  autonomy: { autonomy: 1.2, controlResistance: 1.1, autonomyNeed: 0.9, cognitiveFreedom: 0.7, identityProtection: 0.6, boundaryStrength: 0.4, ruleAversion: 0.4 },
  curiosity: { curiosity: 1.2, explorationDrive: 0.8, darkCuriosity: 0.7, motiveScanning: 0.5, Ne: 0.5 },
  sensuality: { sensuality: 1.1, Se: 0.7, warmthSeeking: 0.6, emotionalIntensity: 0.6 },
  noveltySeeking: { noveltySeeking: 1.1, Ne: 0.8, Se: 0.6, explorationDrive: 0.6, adaptability: 0.5, stagnationFear: 0.4 },
  dominance: { dominance: 1.1, controlNeed: 0.7, Te: 0.6, efficiencyBias: 0.5 },
  socialMasking: { socialMasking: 1.2, validationSeeking: 0.7, validationNeed: 0.7, egoDefense: 0.4, charmSkepticism: 0.3 },
  logicalDetachment: { logicalDetachment: 1.1, Ti: 0.8, utilitarianism: 0.5, detachment: 0.5, logic: 0.4 },
  ambition: { ambition: 1.1, growthOrientation: 0.8, competenceRespect: 0.6, Te: 0.5, validationNeed: 0.4 },
  emotionalDepth: { emotionalDepth: 1.1, Fi: 0.8, attachmentNeed: 0.6, empathy: 0.5, existentialThinking: 0.4 },
  controlNeed: { controlNeed: 1.1, Te: 0.6, dominance: 0.4, systemsThinking: 0.4, responsibility: 0.3 },
  abstraction: { abstraction: 1.1, Ni: 0.8, Ti: 0.6, existentialThinking: 0.6, contextDependence: 0.3 },
  strategicThinking: { strategicThinking: 1.1, Ni: 0.8, Te: 0.5, systemsThinking: 0.7, utilitarianism: 0.4, contextDependence: 0.3 },
  validationNeed: { validationNeed: 1.1, identityNeed: 0.7, validationSeeking: 0.7, competenceRespect: 0.4 },
  darkCuriosity: { darkCuriosity: 1.1, strategicThinking: 0.5, trustSensitivity: 0.5, motiveScanning: 0.5, ambiguitySensitivity: 0.4 },
  attachmentNeed: { attachmentNeed: 1.1, loyaltyBias: 0.8, attachment: 0.7, emotionalDepth: 0.5, collectiveEmpathy: 0.3 },
  chaosAttraction: { darkCuriosity: 0.7, emotionalIntensity: 0.7, ambiguitySensitivity: 0.5, noveltySeeking: 0.4 }
});

function weightedComposite(scores = {}, weights = {}) {
  let weighted = 0;
  let total = 0;

  Object.entries(weights).forEach(([key, weight]) => {
    if (!Number.isFinite(Number(scores[key]))) return;
    weighted += Number(scores[key]) * Number(weight);
    total += Math.abs(Number(weight));
  });

  return total ? Math.round(clamp(weighted / total, 0, 100)) : 0;
}

export function calculateCustomTraits(normalized = {}) {
  return Object.fromEntries(
    Object.entries(CUSTOM_TRAIT_COMPOSITES).map(([trait, weights]) => [trait, weightedComposite(normalized, weights)])
  );
}

function addRawScores(scores, weights = {}, multiplier = 1) {
  Object.entries(weights).forEach(([trait, weight]) => {
    scores[trait] = (scores[trait] || 0) + (Number(weight) || 0) * multiplier;
  });
}

function addQuestionPotential(maxAbs, questionId, multiplier = 1) {
  const optionMappings = mappingsByQuestionId[questionId] || {};
  const maxByTrait = {};

  Object.values(optionMappings).forEach((mapping) => {
    Object.entries(mapping || {}).forEach(([trait, weight]) => {
      maxByTrait[trait] = Math.max(maxByTrait[trait] || 0, Math.abs(Number(weight) || 0));
    });
  });

  Object.entries(maxByTrait).forEach(([trait, max]) => {
    maxAbs[trait] = (maxAbs[trait] || 0) + max * multiplier;
  });
}

function splitRawScores(raw = {}) {
  const functionSet = new Set(cognitiveFunctions);
  const rawFunctionScores = {};
  const rawTraitScores = {};

  Object.entries(raw).forEach(([key, value]) => {
    if (functionSet.has(key)) rawFunctionScores[key] = value;
    else rawTraitScores[key] = value;
  });

  return { rawFunctionScores, rawTraitScores };
}

function evidenceByTrait(reasonTrail = []) {
  return reasonTrail.reduce((map, item) => {
    if (!map[item.trait]) map[item.trait] = [];
    map[item.trait].push({
      question: item.question,
      answer: item.optionText,
      impact: item.impact,
      direction: item.direction
    });
    return map;
  }, {});
}

export function scoreTraits({ testType = "mbti", answers = [] } = {}) {
  const questions = getQuestionSet(testType);
  const parsedAnswers = parseAnswers(answers, testType);
  const raw = {};
  const maxAbs = {};
  const reasonTrail = [];

  parsedAnswers.forEach((answer) => {
    const mapping = getMapping(answer.questionId, answer.optionKey);
    const multiplier = answer.multiplier || 1;
    addRawScores(raw, mapping, multiplier);
    addQuestionPotential(maxAbs, answer.questionId, multiplier);

    Object.entries(mapping).forEach(([trait, weight]) => {
      const impact = round((Number(weight) || 0) * multiplier, 2);
      if (!impact) return;

      reasonTrail.push({
        trait,
        label: traitDefinitions[trait]?.label || trait,
        questionId: answer.questionId,
        source: answer.sourceId || answer.questionId,
        question: answer.question,
        answer: answer.optionKey,
        optionKey: answer.optionKey,
        optionText: answer.optionText,
        impact,
        direction: impact > 0 ? "increase" : "decrease"
      });
    });
  });

  const normalized = normalizePositive(raw, maxAbs, Object.keys(traitDefinitions));
  const functionScores = normalizePositive(raw, maxAbs, cognitiveFunctions);
  const functionRatios = Object.fromEntries(cognitiveFunctions.map((key) => [key, clamp((raw[key] || 0) / Math.max(0.001, maxAbs[key] || 0), 0, 1)]));
  const customTraits = calculateCustomTraits({ ...normalized, ...functionScores });
  const fullTraitScores = { ...normalized, ...customTraits };
  const topTraits = topScores(fullTraitScores, traitDefinitions, 14, 60);
  const answeredIds = new Set(parsedAnswers.map((answer) => answer.questionId));
  const missingQuestionIds = questions.filter((question) => !answeredIds.has(question.id)).map((question) => question.id);
  const { rawFunctionScores, rawTraitScores } = splitRawScores(raw);

  return {
    testType,
    raw,
    rawFunctionScores,
    rawTraitScores,
    maxAbs,
    normalized,
    normalizedTraits: normalized,
    functionScores,
    functionRatios,
    customTraits,
    fullTraitScores,
    topTraits,
    reasonTrail,
    evidenceByTrait: evidenceByTrait(reasonTrail),
    parsedAnswers,
    answersUsed: parsedAnswers.length,
    answeredCount: parsedAnswers.length,
    totalQuestions: questions.length,
    coverage: questions.length ? Math.round((parsedAnswers.length / questions.length) * 100) : 0,
    missingQuestionIds
  };
}

export function installTraitEngineGlobals(target = globalThis) {
  target.CogniLensEngine = {
    ...(target.CogniLensEngine || {}),
    scoreTraits,
    calculateCustomTraits,
    CUSTOM_TRAIT_COMPOSITES
  };
}

if (typeof window !== "undefined") installTraitEngineGlobals(window);
