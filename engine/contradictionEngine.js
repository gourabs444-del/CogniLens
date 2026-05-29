export const CONTRADICTION_RULES = Object.freeze([
  {
    type: "attachment_conflict",
    traits: ["autonomy", "attachmentNeed"],
    severity: 20,
    description: "Strong independence needs appear alongside a strong need for emotional connection.",
    test: (scores) => high(scores.autonomy) && high(scores.attachmentNeed)
  },
  {
    type: "intimacy_dependence_tension",
    traits: ["attachmentNeed", "dependenceAversion"],
    severity: 18,
    description: "Connection needs appear with discomfort around dependence.",
    test: (scores) => high(scores.attachmentNeed) && high(scores.dependenceAversion)
  },
  {
    type: "empathy_detachment_tension",
    traits: ["empathy", "logicalDetachment"],
    severity: 16,
    description: "Empathic sensitivity appears alongside a preference for emotionally detached analysis.",
    test: (scores) => high(scores.empathy) && high(scores.logicalDetachment)
  },
  {
    type: "control_chaos_tension",
    traits: ["controlNeed", "chaosAttraction"],
    severity: 16,
    description: "A need for control appears alongside attraction to uncertain or intense situations.",
    test: (scores) => high(scores.controlNeed) && high(scores.chaosAttraction)
  },
  {
    type: "intensity_suppression_tension",
    traits: ["emotionalIntensity", "emotionalGuardedness"],
    severity: 18,
    description: "Emotional intensity appears alongside emotional guarding or suppression.",
    test: (scores) => high(scores.emotionalIntensity) && high(scores.emotionalGuardedness)
  },
  {
    type: "truth_compassion_tension",
    traits: ["truthCourage", "compassion"],
    severity: 12,
    description: "Truth orientation appears alongside a strong wish to protect people from harm.",
    test: (scores) => high(scores.truthCourage) && high(scores.compassion)
  },
  {
    type: "autonomy_validation_tension",
    traits: ["autonomy", "validationNeed"],
    severity: 14,
    description: "Self-direction appears alongside sensitivity to being valued or recognized.",
    test: (scores) => high(scores.autonomy) && high(scores.validationNeed)
  },
  {
    type: "harm_utilitarian_tension",
    traits: ["harmAvoidance", "utilitarianism"],
    severity: 16,
    description: "Harm avoidance appears alongside outcome-based tradeoff reasoning.",
    test: (scores) => high(scores.harmAvoidance) && high(scores.utilitarianism)
  }
]);

const DEFAULT_HIGH_THRESHOLD = 70;

function high(value, threshold = DEFAULT_HIGH_THRESHOLD) {
  return Number(value) >= threshold;
}

export function analyzeContradictions({ traitResult = {}, eq = null } = {}) {
  const scores = {
    ...(traitResult.normalized || {}),
    ...(traitResult.functionScores || {}),
    ...(traitResult.customTraits || {}),
    ...(eq?.scores || {})
  };

  const contradictions = CONTRADICTION_RULES
    .filter((rule) => rule.test(scores))
    .map((rule) => ({
      type: rule.type,
      severity: rule.severity,
      traits: rule.traits,
      description: rule.description
    }));

  const severity = Math.min(100, contradictions.reduce((sum, item) => sum + item.severity, 0));
  const consistencyPenalty = Math.round(severity * 0.7);

  return {
    contradictions,
    severity,
    score: severity,
    consistencyPenalty,
    consistencyScore: Math.max(0, 100 - consistencyPenalty)
  };
}

export function installContradictionEngineGlobals(target = globalThis) {
  target.CogniLensEngine = {
    ...(target.CogniLensEngine || {}),
    analyzeContradictions,
    CONTRADICTION_RULES
  };
}

if (typeof window !== "undefined") installContradictionEngineGlobals(window);
