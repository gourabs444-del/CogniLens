import { cognitiveFunctions, traitDefinitions } from "../data/traits.js";
import { CUSTOM_TRAIT_COMPOSITES } from "./traitEngine.js";
import { EQ_COMPOSITES } from "./eqEngine.js";

export const REASONING_CONFIG = Object.freeze({
  maxEvidencePerTrait: 5,
  minReasoningScore: 62
});

const COGNITIVE_FUNCTION_SET = new Set(cognitiveFunctions);

function sourceTraitsFor(trait) {
  return new Set([
    trait,
    ...Object.keys(CUSTOM_TRAIT_COMPOSITES[trait] || {}),
    ...(EQ_COMPOSITES[trait] || [])
  ]);
}

function evidenceForTrait(trait, reasonTrail = []) {
  const sourceTraits = sourceTraitsFor(trait);
  return reasonTrail
    .filter((item) => sourceTraits.has(item.trait))
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, REASONING_CONFIG.maxEvidencePerTrait)
    .map((item) => ({
      question: item.question,
      answer: item.optionText,
      impact: Math.abs(item.impact),
      direction: item.direction,
      sourceTrait: item.trait
    }));
}

function sourcePhrase(evidence = []) {
  const positive = evidence.filter((item) => item.direction === "increase");
  if (positive.length >= 3) return "repeated choices";
  if (positive.length === 2) return "a couple of choices";
  return "one noticeable choice";
}

export function summarizeTrait(trait, score, evidence = []) {
  const definition = traitDefinitions[trait] || { label: trait, description: "" };
  const label = definition.label || trait;
  const examples = evidence.slice(0, 2).map((item) => `"${item.answer}"`);
  const exampleText = examples.length ? `, especially ${examples.join(" and ")}` : "";

  if (score >= 78) {
    return `Your ${label} signal is elevated because ${sourcePhrase(evidence)} leaned toward this pattern${exampleText}. This should be read as a tendency, not a fixed label.`;
  }

  if (score >= 62) {
    return `Your answers show a moderate ${label} signal, mainly from ${sourcePhrase(evidence)}${exampleText}. It suggests a situational tendency rather than an absolute trait.`;
  }

  return `There is only a light ${label} signal in the current answers, so this part of the profile should stay tentative.`;
}

function collectReasoningCandidates(traitResult = {}, eq = null) {
  const combinedScores = {
    ...(traitResult.functionScores || {}),
    ...(traitResult.normalized || {}),
    ...(traitResult.customTraits || {}),
    ...(eq?.scores || {})
  };
  const evidenceTraits = Object.keys(traitResult.evidenceByTrait || {});
  const primaryTraits = Object.keys({
    ...(traitResult.customTraits || {}),
    ...(eq?.scores || {})
  });
  const keys = new Set([...evidenceTraits, ...primaryTraits]);

  return [...keys]
    .map((trait) => [trait, Number(combinedScores[trait]) || 0])
    .sort((a, b) => {
      const aPrimary = COGNITIVE_FUNCTION_SET.has(a[0]) ? 0 : 1;
      const bPrimary = COGNITIVE_FUNCTION_SET.has(b[0]) ? 0 : 1;
      return bPrimary - aPrimary || b[1] - a[1];
    });
}

export function buildReasoning({ traitResult = {}, mbti = null, eq = null, confidence = null, contradiction = null } = {}) {
  const candidateTraits = collectReasoningCandidates(traitResult, eq);

  const byTrait = Object.fromEntries(candidateTraits.map(([trait, score]) => {
    const evidence = evidenceForTrait(trait, traitResult.reasonTrail || []);
    return [trait, {
      score: Math.round(score),
      label: traitDefinitions[trait]?.label || trait,
      summary: summarizeTrait(trait, score, evidence),
      evidence
    }];
  }));

  const topTraitLabels = candidateTraits
    .filter(([trait, score]) => !COGNITIVE_FUNCTION_SET.has(trait) && score >= REASONING_CONFIG.minReasoningScore)
    .slice(0, 4)
    .map(([trait]) => traitDefinitions[trait]?.label || trait);
  const mbtiLine = mbti?.topType ? `${mbti.topType} is the strongest MBTI probability in this run.` : "";
  const eqLine = eq?.attachmentStyle ? `EQ signals look ${eq.attachmentStyle}.` : "";
  const contradictionLine = contradiction?.contradictions?.length
    ? `Some internal tension is present: ${contradiction.contradictions.map((item) => item.description).join(" ")}`
    : "No major contradiction pattern crossed the current threshold.";
  const confidenceLine = confidence?.score ? `Confidence is ${confidence.score}% because coverage, repeated patterns, timing, certainty, and consistency were combined.` : "";

  return {
    summary: [mbtiLine, eqLine, topTraitLabels.length ? `The clearest repeated signals are ${topTraitLabels.join(", ")}.` : "", contradictionLine, confidenceLine].filter(Boolean).join(" "),
    traits: byTrait,
    groupedReasons: groupReasonTrail(traitResult.reasonTrail || [])
  };
}

export function groupReasonTrail(reasonTrail = []) {
  return reasonTrail.reduce((map, item) => {
    if (!map[item.trait]) map[item.trait] = [];
    map[item.trait].push(item);
    return map;
  }, {});
}

export function installReasoningEngineGlobals(target = globalThis) {
  target.CogniLensEngine = {
    ...(target.CogniLensEngine || {}),
    buildReasoning,
    summarizeTrait,
    groupReasonTrail
  };
}

if (typeof window !== "undefined") installReasoningEngineGlobals(window);
