import { getQuestionsByCategory } from "../data/questions.js";
import { clamp } from "./scoreNormalizer.js";

export const ANSWER_PARSER_CONFIG = Object.freeze({
  minCertaintyMultiplier: 0.45,
  maxCertaintyMultiplier: 1.2,
  veryFastMs: 600,
  normalUpperMs: 15000,
  slowUpperMs: 45000,
  veryFastMultiplier: 0.82,
  slowMultiplier: 0.9,
  verySlowMultiplier: 0.76,
  timeoutMultiplier: 0.58
});

export function getQuestionSet(testType = "mbti") {
  return getQuestionsByCategory(testType);
}

export function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

export function optionEntries(options = {}) {
  if (Array.isArray(options)) {
    return options.map((option, index) => [String.fromCharCode(65 + index), option?.text || option]);
  }

  return Object.entries(options);
}

export function selectedOptionKey(answer = {}) {
  const direct = answer.answer || answer.optionKey || answer.selectedOption || answer.value;
  if (typeof direct === "string" && direct.trim()) return direct.trim().toUpperCase();

  const index = selectedIndex(answer);
  if (index < 0) return "";
  return String.fromCharCode(65 + index);
}

export function selectedIndex(answer = {}) {
  if (Number.isInteger(answer.optionIndex)) return answer.optionIndex;
  if (Number.isInteger(answer.selected)) return answer.selected;
  if (Array.isArray(answer.values) && answer.values.length) {
    const values = answer.values.map((value) => Number(value) || 0);
    const max = Math.max(...values);
    return values.findIndex((value) => value === max);
  }
  return -1;
}

export function findQuestion(answer = {}, index = 0, testType = "mbti") {
  const questions = getQuestionSet(testType);
  const source = answer.questionId || answer.id;
  const byId = questions.find((question) => question.id === source || question.sourceId === source);
  if (byId) return byId;

  const byText = questions.find((question) => normalizeText(question.question) === normalizeText(answer.question));
  if (byText) return byText;

  return questions[index] || null;
}

export function timingMultiplier(answer = {}, config = ANSWER_PARSER_CONFIG) {
  if (Number.isFinite(Number(answer.certainty))) {
    return clamp(Number(answer.certainty), config.minCertaintyMultiplier, config.maxCertaintyMultiplier);
  }

  if (answer.timedOut) return config.timeoutMultiplier;

  const ms = Number(answer.reactionTimeMs || answer.timeTaken || answer.timeTakenMs);
  if (!Number.isFinite(ms) || ms <= 0) return 1;
  if (ms < config.veryFastMs) return config.veryFastMultiplier;
  if (ms < config.normalUpperMs) return 1;
  if (ms < config.slowUpperMs) return config.slowMultiplier;
  return config.verySlowMultiplier;
}

export function parseAnswers(rawAnswers = [], testType = "mbti") {
  if (!Array.isArray(rawAnswers)) return [];

  return rawAnswers.map((answer, index) => {
    const question = findQuestion(answer, index, testType);
    const optionKey = selectedOptionKey(answer);
    const optionText = question ? Object.fromEntries(optionEntries(question.options))[optionKey] : null;

    if (!question || !optionKey || !optionText) return null;

    return {
      raw: answer,
      questionId: question.id,
      sourceId: question.sourceId,
      category: question.category,
      phase: question.phase,
      question: question.question,
      optionKey,
      optionText,
      optionIndex: optionKey.charCodeAt(0) - 65,
      multiplier: timingMultiplier(answer),
      certainty: Number.isFinite(Number(answer.certainty)) ? Number(answer.certainty) : null,
      reactionTimeMs: Number(answer.reactionTimeMs || answer.timeTaken || answer.timeTakenMs) || null
    };
  }).filter(Boolean);
}

export function installAnswerParserGlobals(target = globalThis) {
  target.CogniLensUtils = {
    ...(target.CogniLensUtils || {}),
    getQuestionSet,
    normalizeText,
    optionEntries,
    selectedOptionKey,
    selectedIndex,
    findQuestion,
    timingMultiplier,
    parseAnswers
  };
}

if (typeof window !== "undefined") installAnswerParserGlobals(window);
