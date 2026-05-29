import { clamp } from "./scoreNormalizer.js";

export const PERCENTAGE_CONFIG = Object.freeze({
  softmaxTemperature: 12
});

export function averageKnown(values = [], fallback = 50) {
  const clean = values.map(Number).filter(Number.isFinite);
  if (!clean.length) return fallback;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

export function pairPercent(left, right) {
  const l = Math.max(0, Number(left) || 0);
  const r = Math.max(0, Number(right) || 0);
  if (l + r <= 0) return 50;
  return Math.round(clamp((l / (l + r)) * 100));
}

export function normalizeCompatibilityScore(rawScore, weights = {}) {
  const positiveMax = Object.values(weights)
    .filter((weight) => Number(weight) > 0)
    .reduce((sum, weight) => sum + Number(weight) * 100, 0);
  const negativeMin = Object.values(weights)
    .filter((weight) => Number(weight) < 0)
    .reduce((sum, weight) => sum + Number(weight) * 100, 0);
  const range = Math.max(1, positiveMax - negativeMin);
  return Math.round(clamp(((rawScore - negativeMin) / range) * 100));
}

export function softmaxPercentages(scores = {}, temperature = PERCENTAGE_CONFIG.softmaxTemperature) {
  const entries = Object.entries(scores);
  if (!entries.length) return {};
  const max = Math.max(...entries.map(([, value]) => Number(value) || 0));
  const exp = entries.map(([key, value]) => [key, Math.exp(((Number(value) || 0) - max) / temperature)]);
  const total = exp.reduce((sum, [, value]) => sum + value, 0) || 1;
  return exp.reduce((out, [key, value]) => {
    out[key] = Math.round((value / total) * 100);
    return out;
  }, {});
}

export function sortPercentageObject(percentages = {}) {
  return Object.fromEntries(Object.entries(percentages).sort((a, b) => b[1] - a[1]));
}

export function rankPercentages(percentages = {}) {
  return Object.entries(percentages)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({ key, value }));
}

export function installPercentageGlobals(target = globalThis) {
  target.CogniLensUtils = {
    ...(target.CogniLensUtils || {}),
    averageKnown,
    pairPercent,
    normalizeCompatibilityScore,
    softmaxPercentages,
    sortPercentageObject,
    rankPercentages
  };
}

if (typeof window !== "undefined") installPercentageGlobals(window);
