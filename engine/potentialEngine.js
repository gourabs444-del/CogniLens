import { cognitiveFunctions, traitDefinitions } from "../data/traits.js";

export const POTENTIAL_FIELD_RULES = Object.freeze([
  {
    id: "strategic_analysis",
    title: "Strategic analysis and planning",
    shortTitle: "Strategic planning",
    color: "#2563eb",
    roles: ["Strategy", "Research", "Product thinking"],
    action: "pattern reading, planning, and second-order thinking",
    weights: {
      strategicThinking: 1.25,
      systemsThinking: 1,
      Ni: 1,
      Te: 0.75,
      abstraction: 0.7,
      predictionFocus: 0.6,
      longTermImpact: 0.45
    }
  },
  {
    id: "structured_execution",
    title: "Structured execution and operations",
    shortTitle: "Execution",
    color: "#f97316",
    roles: ["Operations", "Project delivery", "Process improvement"],
    action: "turning messy work into clear steps and measurable outcomes",
    weights: {
      Te: 1.2,
      responsibility: 0.95,
      controlNeed: 0.75,
      efficiencyBias: 0.7,
      growthOrientation: 0.6,
      Si: 0.55,
      Judging: 0.4
    }
  },
  {
    id: "people_insight",
    title: "People insight and trust-building",
    shortTitle: "People insight",
    color: "#10b981",
    roles: ["Team guidance", "Coaching", "User empathy"],
    action: "reading people, reducing friction, and helping groups coordinate",
    weights: {
      Fe: 1,
      empathy: 1,
      emotionalAwareness: 0.9,
      socialInsight: 0.8,
      humanUnderstanding: 0.75,
      attachmentNeed: 0.45,
      collectiveEmpathy: 0.45
    }
  },
  {
    id: "creative_exploration",
    title: "Creative exploration and ideation",
    shortTitle: "Exploration",
    color: "#7c3aed",
    roles: ["Creative direction", "Concept work", "Innovation"],
    action: "generating alternatives, trying fresh angles, and adapting quickly",
    weights: {
      Ne: 1.25,
      curiosity: 1,
      noveltySeeking: 0.95,
      explorationDrive: 0.8,
      adaptability: 0.65,
      abstraction: 0.5,
      Perceiving: 0.4
    }
  },
  {
    id: "crisis_response",
    title: "Crisis response and tactical action",
    shortTitle: "Tactical action",
    color: "#06b6d4",
    roles: ["Rapid response", "Field work", "Problem solving"],
    action: "noticing what is happening now and acting before things drift",
    weights: {
      Se: 1.25,
      Ti: 0.75,
      emotionalControl: 0.65,
      adaptability: 0.6,
      uncertaintyTolerance: 0.55,
      executionFocus: 0.45
    }
  },
  {
    id: "independent_research",
    title: "Independent research and deep work",
    shortTitle: "Deep work",
    color: "#0f766e",
    roles: ["Analysis", "Writing", "Technical depth"],
    action: "staying with a problem until the structure becomes clear",
    weights: {
      Ti: 1.1,
      Ni: 0.9,
      logicalDetachment: 0.9,
      abstraction: 0.75,
      solitudeComfort: 0.65,
      analysisNeed: 0.6,
      Introversion: 0.35
    }
  },
  {
    id: "stability_systems",
    title: "Stability systems and reliable support",
    shortTitle: "Reliability",
    color: "#64748b",
    roles: ["Quality control", "Support systems", "Documentation"],
    action: "protecting continuity, standards, and dependable follow-through",
    weights: {
      Si: 1.25,
      responsibility: 0.95,
      reliabilityNeed: 0.8,
      ruleOrientation: 0.65,
      emotionalBalance: 0.5,
      accountability: 0.5,
      Sensing: 0.35
    }
  },
  {
    id: "growth_coaching",
    title: "Growth coaching and personal development",
    shortTitle: "Growth",
    color: "#db2777",
    roles: ["Mentorship", "Self-improvement", "Behavior design"],
    action: "turning feedback into practical repair and personal growth",
    weights: {
      growthOrientation: 1.1,
      emotionalMaturity: 0.9,
      empathy: 0.7,
      accountability: 0.7,
      Fi: 0.65,
      Fe: 0.55,
      vulnerabilityTolerance: 0.45
    }
  }
]);

const DIMENSION_KEYS = new Set(["Introversion", "Extraversion", "Intuition", "Sensing", "Thinking", "Feeling", "Judging", "Perceiving", "confidence"]);
const RESERVED_KEYS = new Set([...cognitiveFunctions, ...DIMENSION_KEYS]);

function clamp(value, min = 0, max = 100) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.max(min, Math.min(max, numeric));
}

function rounded(value) {
  return Math.round(clamp(value));
}

function mergeSignals(target, source = {}, transform = (value) => value) {
  Object.entries(source || {}).forEach(([key, value]) => {
    const numeric = Number(transform(value, key));
    if (!Number.isFinite(numeric)) return;
    target[key] = Math.max(Number(target[key]) || 0, clamp(numeric));
  });
}

export function collectPotentialSignals(report = {}) {
  const signals = {};
  mergeSignals(signals, report.traits);
  mergeSignals(signals, report.traitScores);
  mergeSignals(signals, report.cognitiveFunctions);
  mergeSignals(signals, report.functionScores);
  mergeSignals(signals, report.eq);

  Object.entries(report.functionRatios || {}).forEach(([key, value]) => {
    signals[key] = Math.max(Number(signals[key]) || 0, clamp(Number(value) * 100));
  });

  const metrics = report.metrics || {};
  if (Number.isFinite(Number(metrics.I))) {
    signals.Introversion = clamp(metrics.I);
    signals.Extraversion = clamp(100 - Number(metrics.I));
  }
  if (Number.isFinite(Number(metrics.N))) {
    signals.Intuition = clamp(metrics.N);
    signals.Sensing = clamp(100 - Number(metrics.N));
  }
  if (Number.isFinite(Number(metrics.T))) {
    signals.Thinking = clamp(metrics.T);
    signals.Feeling = clamp(100 - Number(metrics.T));
  }
  if (Number.isFinite(Number(metrics.J))) {
    signals.Judging = clamp(metrics.J);
    signals.Perceiving = clamp(100 - Number(metrics.J));
  }

  const confidence = typeof report.confidence === "object" ? report.confidence?.score : report.confidenceScore ?? report.modelConfidence ?? report.confidence;
  if (Number.isFinite(Number(confidence))) signals.confidence = clamp(confidence);

  return signals;
}

function labelFor(key) {
  if (traitDefinitions[key]?.label) return traitDefinitions[key].label;
  const labels = {
    Introversion: "introversion",
    Extraversion: "extraversion",
    Intuition: "intuition",
    Sensing: "sensing",
    Thinking: "thinking",
    Feeling: "feeling",
    Judging: "judging",
    Perceiving: "perceiving"
  };
  return labels[key] || key.replace(/([A-Z])/g, " $1").trim();
}

function formatList(items = []) {
  const unique = [...new Set(items.filter(Boolean))];
  if (unique.length <= 1) return unique[0] || "your answer pattern";
  if (unique.length === 2) return unique[0] + " and " + unique[1];
  return unique.slice(0, -1).join(", ") + ", and " + unique[unique.length - 1];
}

function topDrivers(rule, signals) {
  return Object.entries(rule.weights || {})
    .map(([key, weight]) => ({
      key,
      label: labelFor(key),
      value: Number(signals[key]) || 0,
      contribution: (Number(signals[key]) || 0) * Number(weight || 0)
    }))
    .filter((item) => item.value > 0 && item.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution);
}

export function scorePotentialField(rule, signals = {}) {
  let weighted = 0;
  let total = 0;

  Object.entries(rule.weights || {}).forEach(([key, weight]) => {
    if (!Number.isFinite(Number(signals[key]))) return;
    weighted += clamp(signals[key]) * Number(weight);
    total += Math.abs(Number(weight));
  });

  return total ? rounded(weighted / total) : 0;
}

function evidenceForField(report, rule) {
  const keys = new Set(Object.keys(rule.weights || {}));
  return (report.reasonTrail || [])
    .filter((item) => keys.has(item.trait))
    .sort((a, b) => Math.abs(Number(b.impact) || 0) - Math.abs(Number(a.impact) || 0))
    .slice(0, 4)
    .map((item) => ({
      trait: item.trait,
      label: item.label || labelFor(item.trait),
      question: item.question,
      answer: item.optionText || item.answer,
      impact: item.impact
    }));
}

function buildField(rule, report, signals) {
  const score = scorePotentialField(rule, signals);
  const drivers = topDrivers(rule, signals).slice(0, 3);
  const driverLabels = drivers.map((item) => item.label.toLowerCase());
  const reason = drivers.length
    ? formatList(driverLabels) + " made this scope score higher in the answer model."
    : "This scope has limited evidence so far.";

  return {
    id: rule.id,
    title: rule.title,
    shortTitle: rule.shortTitle,
    score,
    color: rule.color,
    reason,
    roles: rule.roles,
    action: rule.action,
    drivers,
    evidence: evidenceForField(report, rule)
  };
}

function hasUsablePotentialSignal(report, signals) {
  const answerCount = Number(report.answeredCount || report.answersUsed || report.answers?.length || report.meta?.answersUsed || 0);
  const hasTraits = Object.keys(report.traits || {}).length > 0 || Object.keys(report.traitScores || {}).length > 0;
  const hasFunctions = cognitiveFunctions.some((key) => Number(signals[key]) > 0);
  const neutralMetrics = ["I", "N", "T", "J"].every((key) => Math.round(Number(report.metrics?.[key]) || 50) === 50);
  return answerCount > 0 || hasTraits || hasFunctions || (report.type && report.type !== "UNCL" && !neutralMetrics);
}

function topTraitSignals(signals) {
  return Object.entries(signals)
    .filter(([key, value]) => !RESERVED_KEYS.has(key) && Number(value) > 0)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 8)
    .map(([key, value]) => ({ key, label: labelFor(key), score: rounded(value) }));
}

function topFunctionSignal(signals) {
  return cognitiveFunctions
    .map((key) => ({ key, label: labelFor(key), score: rounded(signals[key] || 0) }))
    .sort((a, b) => b.score - a.score)[0];
}

function buildStrengths(report, signals, topFields) {
  const traits = topTraitSignals(signals);
  const field = topFields[0];
  const primaryTrait = traits[0];
  const primaryFunction = topFunctionSignal(signals);
  const strengths = [];

  if (field) {
    strengths.push(field.shortTitle + " is your highest-scope zone; it should compound faster when the task involves " + field.action + ".");
  }
  if (primaryTrait) {
    strengths.push(primaryTrait.label + " is one of your strongest signals, so use it as a repeatable advantage instead of a mood-based guess.");
  }
  if (primaryFunction && primaryFunction.score > 0) {
    strengths.push(primaryFunction.label + " is the strongest cognitive signal in this result, which helps explain the direction of your best-fit fields.");
  }

  return strengths.slice(0, 3);
}

function buildRisks(report, signals, topFields) {
  const risks = [];
  const push = (condition, text) => {
    if (condition && !risks.includes(text)) risks.push(text);
  };

  push(signals.autonomy >= 70 && signals.attachmentNeed >= 70, "Strong independence and connection needs can pull against each other, so define closeness and boundaries clearly.");
  push(signals.controlNeed >= 65 && signals.noveltySeeking >= 60, "A need for control plus novelty can create stop-start momentum; decide which changes are worth acting on before switching direction.");
  push(signals.logicalDetachment >= 65 && (signals.emotionalDepth || signals.empathy || 0) < 55, "Logic may move faster than emotional check-ins under pressure; add one people-impact review before final calls.");
  push(signals.emotionalGuardedness >= 65 || signals.exposureFear >= 65, "You may keep strain private for too long; share small status updates before pressure turns into distance.");
  push(signals.validationNeed >= 65 || signals.validationSeeking >= 65, "Recognition can affect momentum; measure progress by output quality, not only by outside reaction.");
  push(signals.darkCuriosity >= 70 && signals.trustSensitivity >= 60, "Reading hidden motives can be useful, but over-scanning may make neutral behavior look suspicious.");

  const contradictions = report.contradictions || report.contradictionSummary?.contradictions || [];
  contradictions.slice(0, 2).forEach((item) => {
    const text = item.description || String(item);
    if (text && risks.length < 3) risks.push(text);
  });

  if (!risks.length && topFields[0]) {
    risks.push("Your main growth risk is overusing " + topFields[0].shortTitle.toLowerCase() + " when the situation needs a different mode.");
  }
  if (risks.length < 2 && topFields[1]) {
    risks.push("Balance " + topFields[0].shortTitle.toLowerCase() + " with " + topFields[1].shortTitle.toLowerCase() + " so your profile stays flexible.");
  }

  return risks.slice(0, 3);
}

function buildGrowthPlan(signals, topFields) {
  const field = topFields[0];
  const traits = topTraitSignals(signals);
  const trait = traits[0];
  if (!field) return [];

  return [
    "Days 1-7: Pick one " + field.shortTitle.toLowerCase() + " task and define a visible outcome before starting.",
    "Days 8-18: Use " + (trait ? trait.label.toLowerCase() : "your strongest trait") + " deliberately, then ask for one concrete feedback point.",
    "Days 19-30: Build a simple review loop so your strongest pattern becomes a habit, not only a one-time result."
  ];
}

export function buildPotentialProfile(report = {}) {
  const signals = collectPotentialSignals(report);
  if (!hasUsablePotentialSignal(report, signals)) return null;

  const topFields = POTENTIAL_FIELD_RULES
    .map((rule) => buildField(rule, report, signals))
    .filter((field) => field.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (!topFields.length) return null;

  const focus = topFields[0];
  const confidence = typeof report.confidence === "object" ? report.confidence?.score : report.confidenceScore ?? report.modelConfidence ?? report.confidence;
  const answerCount = Number(report.answeredCount || report.answersUsed || report.answers?.length || report.meta?.answersUsed || 0);
  const strengths = buildStrengths(report, signals, topFields);
  const risks = buildRisks(report, signals, topFields);
  const growthPlan = buildGrowthPlan(signals, topFields);

  return {
    type: report.type || "UNCL",
    headline: focus.shortTitle + " has the highest current scope",
    focus: focus.title,
    focusScore: focus.score,
    confidence: rounded(confidence || 0),
    userLine: "Your answers currently point most strongly toward " + focus.title.toLowerCase() + ".",
    connectiveCopy: "Based on " + answerCount + " answer signals, " + focus.shortTitle.toLowerCase() + " is the area where effort is most likely to compound. This is a potential estimate, not a fixed limit.",
    topFields,
    strengths,
    risks,
    growthPlan,
    scope: {
      focus: focus.title,
      score: focus.score,
      fields: topFields.map((field) => ({
        id: field.id,
        title: field.title,
        score: field.score
      }))
    },
    generatedFrom: "answer-weighted-api-report"
  };
}
