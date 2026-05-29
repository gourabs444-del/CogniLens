export const NORMALIZATION_CONFIG = Object.freeze({
  min: 0,
  max: 100,
  neutral: 50,
  centeredAmplitude: 50,
  tinyDenominator: 0.001
});

export function clamp(value, min = NORMALIZATION_CONFIG.min, max = NORMALIZATION_CONFIG.max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.max(min, Math.min(max, numeric));
}

export function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round((Number(value) || 0) * factor) / factor;
}

export function addWeightedScores(scores, maxAbs, weights = {}, multiplier = 1) {
  Object.entries(weights).forEach(([trait, weight]) => {
    const weighted = (Number(weight) || 0) * multiplier;
    scores[trait] = (scores[trait] || 0) + weighted;
    maxAbs[trait] = (maxAbs[trait] || 0) + Math.abs(weighted);
  });
}

export function normalizeCentered(raw = {}, maxAbs = {}, definitions = {}, config = NORMALIZATION_CONFIG) {
  const keys = new Set([...Object.keys(definitions), ...Object.keys(raw), ...Object.keys(maxAbs)]);
  const out = {};

  keys.forEach((key) => {
    const max = Math.max(config.tinyDenominator, Math.abs(maxAbs[key] || 0));
    const value = raw[key] || 0;
    out[key] = Math.round(clamp(config.neutral + (value / max) * config.centeredAmplitude, config.min, config.max));
  });

  return out;
}

export function normalizePositive(raw = {}, maxAbs = {}, keys = Object.keys(raw), config = NORMALIZATION_CONFIG) {
  const out = {};

  keys.forEach((key) => {
    const max = Math.max(config.tinyDenominator, Math.abs(maxAbs[key] || 0));
    out[key] = Math.round(clamp(((raw[key] || 0) / max) * config.max, config.min, config.max));
  });

  return out;
}

export function topScores(scores = {}, definitions = {}, count = 8, minScore = 55) {
  return Object.entries(scores)
    .filter(([, score]) => Number(score) >= minScore)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key, score]) => ({
      key,
      score: Math.round(score),
      label: definitions[key]?.label || key,
      category: definitions[key]?.category || definitions[key]?.group || "trait",
      description: definitions[key]?.description || ""
    }));
}

export function installScoreNormalizerGlobals(target = globalThis) {
  target.CogniLensUtils = {
    ...(target.CogniLensUtils || {}),
    clamp,
    round,
    addWeightedScores,
    normalizeCentered,
    normalizePositive,
    topScores
  };
}

if (typeof window !== "undefined") installScoreNormalizerGlobals(window);
