import { traitDefinitions } from "../data/traits.js";
import { averageKnown } from "../utils/percentageCalculator.js";
import { clamp } from "../utils/scoreNormalizer.js";

export const EQ_COMPOSITES = Object.freeze({
  empathy: ["empathy", "compassion", "humanUnderstanding", "Fe"],
  emotionalAwareness: ["emotionalAwareness", "selfAwareness", "humanUnderstanding", "Fi", "Fe"],
  emotionalRegulation: ["emotionalControl", "boundaryStrength", "selfPreservation", "egoControl"],
  vulnerabilityTolerance: ["vulnerabilityTolerance", "truthCourage", "authenticity"],
  attachmentNeed: ["attachmentNeed", "attachment", "emptinessSensitivity", "betrayalSensitivity", "memoryAttachment"],
  emotionalGuardedness: ["emotionalGuardedness", "detachment", "selfPreservation", "exposureFear"],
  emotionalIntensity: ["emotionalIntensity", "emotionalReactivity", "attachment", "rumination"],
  emotionalDepth: ["emotionalDepth", "meaningNeed", "Fi", "attachment", "memoryAttachment"]
});

function composite(scores = {}, keys = []) {
  return Math.round(averageKnown(keys.map((key) => scores[key]).filter((value) => Number.isFinite(Number(value)))));
}

export function inferAttachmentStyle(eqScores = {}) {
  const attachment = Number(eqScores.attachmentNeed) || 50;
  const guardedness = Number(eqScores.emotionalGuardedness) || 50;

  if (attachment >= 68 && guardedness >= 68) return "connection-seeking but guarded";
  if (attachment >= 68) return "connection-oriented";
  if (guardedness >= 68) return "self-protective";
  return "balanced";
}

export function analyzeEq(traitResult = {}) {
  const sourceScores = {
    ...(traitResult.normalized || {}),
    ...(traitResult.functionScores || {}),
    ...(traitResult.customTraits || {})
  };

  const scores = Object.fromEntries(
    Object.entries(EQ_COMPOSITES).map(([key, keys]) => [key, clamp(composite(sourceScores, keys))])
  );

  const attachmentStyle = inferAttachmentStyle(scores);
  const behavioralTraits = Object.entries(scores)
    .map(([key, score]) => ({
      key,
      score,
      label: traitDefinitions[key]?.label || key,
      category: traitDefinitions[key]?.category || "eq",
      description: traitDefinitions[key]?.description || "",
      evidence: (traitResult.reasonTrail || [])
        .filter((item) => EQ_COMPOSITES[key]?.includes(item.trait))
        .slice(0, 4)
        .map((item) => ({
          question: item.question,
          answer: item.optionText,
          impact: item.impact
        }))
    }))
    .sort((a, b) => b.score - a.score);

  return {
    scores,
    attachmentStyle,
    behavioralTraits,
    topTraits: behavioralTraits.slice(0, 6),
    profileType: `${behavioralTraits[0]?.label || "Balanced EQ"} Signal Profile`,
    moralScores: {
      empathy: scores.empathy,
      logic: sourceScores.logic || sourceScores.Ti || 50,
      justice: sourceScores.justice || 50,
      compassion: sourceScores.compassion || 50,
      honesty: sourceScores.honesty || 50,
      attachment: scores.attachmentNeed,
      sacrifice: sourceScores.sacrifice || 50,
      selfPreserve: sourceScores.selfPreservation || 50
    }
  };
}

export function installEqEngineGlobals(target = globalThis) {
  target.CogniLensEngine = {
    ...(target.CogniLensEngine || {}),
    analyzeEq,
    inferAttachmentStyle,
    EQ_COMPOSITES
  };
}

if (typeof window !== "undefined") installEqEngineGlobals(window);
