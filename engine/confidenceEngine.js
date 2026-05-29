import { averageKnown } from "../utils/percentageCalculator.js";
import { clamp } from "../utils/scoreNormalizer.js";

export const CONFIDENCE_CONFIG = Object.freeze({
  base: 50,
  repeatedPatternWeight: 0.22,
  consistencyWeight: 0.28,
  contradictionPenaltyWeight: 0.55,
  speedWeight: 0.12,
  certaintyWeight: 0.18,
  coverageWeight: 0.20
});

function labelConsistency(score) {
  if (score >= 78) return "high";
  if (score >= 56) return "moderate";
  return "low";
}

export function repeatedPatternScore(reasonTrail = []) {
  const counts = reasonTrail.reduce((map, item) => {
    if (item.impact > 0) map[item.trait] = (map[item.trait] || 0) + 1;
    return map;
  }, {});
  const repeated = Object.values(counts).filter((count) => count >= 2).length;
  return Math.round(clamp(repeated * 10, 0, 35));
}

export function timingScore(parsedAnswers = []) {
  const timing = averageKnown(parsedAnswers.map((answer) => (answer.multiplier || 1) * 100), 75);
  return Math.round(clamp((timing - 75) * 0.5, -10, 12));
}

export function certaintyStrength(parsedAnswers = []) {
  const certainties = parsedAnswers
    .map((answer) => Number(answer.certainty))
    .filter(Number.isFinite)
    .map((value) => clamp(value * 100));
  return Math.round(averageKnown(certainties, 76));
}

export function calculateConfidence({ traitResult = {}, contradiction = {} } = {}) {
  const coverage = traitResult.coverage || 0;
  const repeatedPatterns = repeatedPatternScore(traitResult.reasonTrail || []);
  const speedBonus = timingScore(traitResult.parsedAnswers || []);
  const certainty = certaintyStrength(traitResult.parsedAnswers || []);
  const consistencyScore = contradiction.consistencyScore ?? 100;
  const consistencyBonus = Math.round((consistencyScore - 50) * CONFIDENCE_CONFIG.consistencyWeight);
  const contradictionPenalty = Math.round((contradiction.severity || contradiction.score || 0) * CONFIDENCE_CONFIG.contradictionPenaltyWeight);
  const coverageBonus = Math.round((coverage - 50) * CONFIDENCE_CONFIG.coverageWeight);
  const certaintyBonus = Math.round((certainty - 50) * CONFIDENCE_CONFIG.certaintyWeight);

  const rawScore =
    CONFIDENCE_CONFIG.base +
    consistencyBonus -
    contradictionPenalty +
    speedBonus +
    Math.round(repeatedPatterns * CONFIDENCE_CONFIG.repeatedPatternWeight) +
    coverageBonus +
    certaintyBonus;

  const score = Math.round(clamp(rawScore, 0, 96));
  const socialMasking = Number(traitResult.customTraits?.socialMasking ?? traitResult.normalized?.socialMasking ?? 0);
  const maskingLikelihood = Math.round(clamp(socialMasking * 0.55 + (100 - certainty) * 0.25 + (contradiction.severity || 0) * 0.2));

  return {
    score,
    consistency: labelConsistency(consistencyScore),
    consistencyScore,
    certaintyStrength: certainty,
    maskingLikelihood,
    components: {
      base: CONFIDENCE_CONFIG.base,
      coverage,
      coverageBonus,
      repeatedPatterns,
      consistencyBonus,
      speedBonus,
      certainty,
      certaintyBonus,
      contradictionPenalty
    }
  };
}

export function installConfidenceEngineGlobals(target = globalThis) {
  target.CogniLensEngine = {
    ...(target.CogniLensEngine || {}),
    calculateConfidence,
    repeatedPatternScore,
    timingScore,
    certaintyStrength
  };
}

if (typeof window !== "undefined") installConfidenceEngineGlobals(window);
