import { cognitiveFunctions, typeTitles } from "../data/traits.js";
import { averageKnown, pairPercent, rankPercentages, sortPercentageObject } from "../utils/percentageCalculator.js";
import { clamp } from "../utils/scoreNormalizer.js";

export const TYPE_WEIGHTS = Object.freeze({
  INTJ: { Ni: 1.5, Te: 1.2, Fi: 0.5, Fe: -0.7, Se: -0.4 },
  INTP: { Ti: 1.5, Ne: 1.2, Te: -0.5, Fe: -0.3 },
  INFJ: { Ni: 1.4, Fe: 1.3, Ti: 0.5, Te: -0.5 },
  ENTP: { Ne: 1.5, Ti: 1.2, Fe: 0.4, Si: -0.5 },
  ENTJ: { Te: 1.5, Ni: 1.1, Se: 0.5, Fi: -0.4 },
  INFP: { Fi: 1.5, Ne: 1.2, Te: -0.6 },
  ENFP: { Ne: 1.5, Fi: 1.2, Si: -0.4 },
  ISTJ: { Si: 1.5, Te: 1.2, Ne: -0.6 },
  ISFJ: { Si: 1.4, Fe: 1.2, Ne: -0.5 },
  ESTP: { Se: 1.5, Ti: 1.1, Ni: -0.5 },
  ESFP: { Se: 1.5, Fi: 1.2, Te: -0.4 },
  ENFJ: { Fe: 1.5, Ni: 1.2, Se: 0.4, Ti: -0.5 },
  ESTJ: { Te: 1.5, Si: 1.2, Fi: -0.6, Ne: -0.3 },
  ESFJ: { Fe: 1.5, Si: 1.2, Ti: -0.6, Ne: -0.3 },
  ISTP: { Ti: 1.5, Se: 1.2, Fe: -0.5, Ni: -0.3 },
  ISFP: { Fi: 1.5, Se: 1.2, Te: -0.5, Ne: -0.2 }
});

export function normalizeFunctions(functionScores = {}, raw = {}, maxAbs = {}) {
  return Object.fromEntries(cognitiveFunctions.map((key) => {
    if (Number.isFinite(Number(raw[key])) && Number(maxAbs[key]) > 0) {
      return [key, clamp(Number(raw[key]) / Number(maxAbs[key]), 0, 1)];
    }

    return [key, clamp((Number(functionScores[key]) || 0) / 100, 0, 1)];
  }));
}

export function scoreType(functionRatios = {}, weights = {}) {
  return Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + (Number(functionRatios[key]) || 0) * Number(weight);
  }, 0);
}

function formulaBounds(weights = {}) {
  return Object.values(weights).reduce((bounds, weight) => {
    const numeric = Number(weight) || 0;
    if (numeric >= 0) bounds.max += numeric;
    else bounds.min += numeric;
    return bounds;
  }, { min: 0, max: 0 });
}

export function calculateMbtiProbabilities(functionRatios = {}) {
  const finalMbtiScores = Object.fromEntries(
    Object.entries(TYPE_WEIGHTS).map(([type, weights]) => [type, scoreType(functionRatios, weights)])
  );

  const probabilities = Object.fromEntries(Object.entries(finalMbtiScores).map(([type, score]) => {
    const { min, max } = formulaBounds(TYPE_WEIGHTS[type]);
    const normalized = max === min ? 0 : ((score - min) / (max - min)) * 100;
    return [type, Math.round(clamp(normalized, 0, 100))];
  }));

  return {
    probabilities: sortPercentageObject(probabilities),
    finalMbtiScores
  };
}

export function buildDimensions(functions = {}) {
  const Iraw = averageKnown([functions.Ni, functions.Ti, functions.Fi, functions.Si]);
  const Eraw = averageKnown([functions.Ne, functions.Te, functions.Fe, functions.Se]);
  const Nraw = averageKnown([functions.Ni, functions.Ne]);
  const Sraw = averageKnown([functions.Si, functions.Se]);
  const Traw = averageKnown([functions.Ti, functions.Te]);
  const Fraw = averageKnown([functions.Fi, functions.Fe]);
  const Jraw = averageKnown([functions.Ni, functions.Te, functions.Si, functions.Fe]);
  const Praw = averageKnown([functions.Ne, functions.Ti, functions.Se, functions.Fi]);

  return {
    raw: { I: Iraw, E: Eraw, N: Nraw, S: Sraw, T: Traw, F: Fraw, J: Jraw, P: Praw },
    metrics: {
      I: pairPercent(Iraw, Eraw),
      N: pairPercent(Nraw, Sraw),
      T: pairPercent(Traw, Fraw),
      J: pairPercent(Jraw, Praw)
    }
  };
}

export function typeFromMetrics(metrics = {}) {
  return `${metrics.I >= 50 ? "I" : "E"}${metrics.N >= 50 ? "N" : "S"}${metrics.T >= 50 ? "T" : "F"}${metrics.J >= 50 ? "J" : "P"}`;
}

export function analyzeMbti(traitResult = {}) {
  const functionRatios = {
    Ni: 0,
    Ne: 0,
    Si: 0,
    Se: 0,
    Ti: 0,
    Te: 0,
    Fi: 0,
    Fe: 0,
    ...normalizeFunctions(traitResult.functionScores || {}, traitResult.raw || {}, traitResult.maxAbs || {})
  };
  const functions = Object.fromEntries(Object.entries(functionRatios).map(([key, value]) => [key, Math.round(value * 100)]));
  const { probabilities, finalMbtiScores } = calculateMbtiProbabilities(functionRatios);
  const ranked = rankPercentages(probabilities);
  const dimensions = buildDimensions(functions);
  const metricType = typeFromMetrics(dimensions.metrics);
  const topType = ranked[0]?.key || metricType || "UNCL";

  return {
    probabilities,
    ranked,
    topType,
    type: topType,
    title: typeTitles[topType] || `${topType} Personality Profile`,
    metricType,
    functions,
    functionRatios,
    finalMbtiScores,
    dimensions: dimensions.raw,
    metrics: dimensions.metrics
  };
}

export function installMbtiEngineGlobals(target = globalThis) {
  target.CogniLensEngine = {
    ...(target.CogniLensEngine || {}),
    analyzeMbti,
    calculateMbtiProbabilities,
    normalizeFunctions,
    buildDimensions,
    typeFromMetrics,
    TYPE_WEIGHTS
  };
}

if (typeof window !== "undefined") installMbtiEngineGlobals(window);
