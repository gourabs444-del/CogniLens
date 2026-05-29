/*
 * CogniLens answer-weighted potential system.
 * Uses the saved API report first, then falls back to local trait/function signals.
 */

(function () {
  const COGNILENS_FIELD_RULES = [
    {
      id: "strategic_analysis",
      title: "Strategic analysis and planning",
      shortTitle: "Strategic planning",
      color: "#2563eb",
      roles: ["Strategy", "Research", "Product thinking"],
      action: "pattern reading, planning, and second-order thinking",
      weights: { strategicThinking: 1.25, systemsThinking: 1, Ni: 1, Te: 0.75, abstraction: 0.7, predictionFocus: 0.6, longTermImpact: 0.45 }
    },
    {
      id: "structured_execution",
      title: "Structured execution and operations",
      shortTitle: "Execution",
      color: "#f97316",
      roles: ["Operations", "Project delivery", "Process improvement"],
      action: "turning messy work into clear steps and measurable outcomes",
      weights: { Te: 1.2, responsibility: 0.95, controlNeed: 0.75, efficiencyBias: 0.7, growthOrientation: 0.6, Si: 0.55, Judging: 0.4 }
    },
    {
      id: "people_insight",
      title: "People insight and trust-building",
      shortTitle: "People insight",
      color: "#10b981",
      roles: ["Team guidance", "Coaching", "User empathy"],
      action: "reading people, reducing friction, and helping groups coordinate",
      weights: { Fe: 1, empathy: 1, emotionalAwareness: 0.9, socialInsight: 0.8, humanUnderstanding: 0.75, attachmentNeed: 0.45, collectiveEmpathy: 0.45 }
    },
    {
      id: "creative_exploration",
      title: "Creative exploration and ideation",
      shortTitle: "Exploration",
      color: "#7c3aed",
      roles: ["Creative direction", "Concept work", "Innovation"],
      action: "generating alternatives, trying fresh angles, and adapting quickly",
      weights: { Ne: 1.25, curiosity: 1, noveltySeeking: 0.95, explorationDrive: 0.8, adaptability: 0.65, abstraction: 0.5, Perceiving: 0.4 }
    },
    {
      id: "crisis_response",
      title: "Crisis response and tactical action",
      shortTitle: "Tactical action",
      color: "#06b6d4",
      roles: ["Rapid response", "Field work", "Problem solving"],
      action: "noticing what is happening now and acting before things drift",
      weights: { Se: 1.25, Ti: 0.75, emotionalControl: 0.65, adaptability: 0.6, uncertaintyTolerance: 0.55, executionFocus: 0.45 }
    },
    {
      id: "independent_research",
      title: "Independent research and deep work",
      shortTitle: "Deep work",
      color: "#0f766e",
      roles: ["Analysis", "Writing", "Technical depth"],
      action: "staying with a problem until the structure becomes clear",
      weights: { Ti: 1.1, Ni: 0.9, logicalDetachment: 0.9, abstraction: 0.75, solitudeComfort: 0.65, analysisNeed: 0.6, Introversion: 0.35 }
    },
    {
      id: "stability_systems",
      title: "Stability systems and reliable support",
      shortTitle: "Reliability",
      color: "#64748b",
      roles: ["Quality control", "Support systems", "Documentation"],
      action: "protecting continuity, standards, and dependable follow-through",
      weights: { Si: 1.25, responsibility: 0.95, reliabilityNeed: 0.8, ruleOrientation: 0.65, emotionalBalance: 0.5, accountability: 0.5, Sensing: 0.35 }
    },
    {
      id: "growth_coaching",
      title: "Growth coaching and personal development",
      shortTitle: "Growth",
      color: "#db2777",
      roles: ["Mentorship", "Self-improvement", "Behavior design"],
      action: "turning feedback into practical repair and personal growth",
      weights: { growthOrientation: 1.1, emotionalMaturity: 0.9, empathy: 0.7, accountability: 0.7, Fi: 0.65, Fe: 0.55, vulnerabilityTolerance: 0.45 }
    }
  ];

  const COGNITIVE_FUNCTIONS = ["Ni", "Ne", "Si", "Se", "Ti", "Te", "Fi", "Fe"];
  const LABELS = {
    Ni: "Introverted Intuition",
    Ne: "Extraverted Intuition",
    Si: "Introverted Sensing",
    Se: "Extraverted Sensing",
    Ti: "Introverted Thinking",
    Te: "Extraverted Thinking",
    Fi: "Introverted Feeling",
    Fe: "Extraverted Feeling",
    strategicThinking: "Strategic Thinking",
    systemsThinking: "Systems Thinking",
    abstraction: "Abstraction",
    predictionFocus: "Prediction Focus",
    longTermImpact: "Long-Term Impact",
    responsibility: "Responsibility",
    controlNeed: "Need for Control",
    efficiencyBias: "Efficiency Bias",
    growthOrientation: "Growth Orientation",
    empathy: "Empathy",
    emotionalAwareness: "Emotional Awareness",
    socialInsight: "Social Insight",
    humanUnderstanding: "Human Understanding",
    attachmentNeed: "Attachment Need",
    collectiveEmpathy: "Collective Empathy",
    curiosity: "Curiosity",
    noveltySeeking: "Novelty Seeking",
    explorationDrive: "Exploration Drive",
    adaptability: "Adaptability",
    emotionalControl: "Emotional Regulation",
    uncertaintyTolerance: "Uncertainty Tolerance",
    executionFocus: "Execution Focus",
    logicalDetachment: "Logical Detachment",
    solitudeComfort: "Solitude Comfort",
    analysisNeed: "Analysis Need",
    reliabilityNeed: "Reliability Need",
    ruleOrientation: "Rule Orientation",
    emotionalBalance: "Emotional Balance",
    accountability: "Accountability",
    emotionalMaturity: "Emotional Maturity",
    vulnerabilityTolerance: "Vulnerability Tolerance",
    autonomy: "Need for Autonomy",
    emotionalDepth: "Emotional Depth",
    emotionalGuardedness: "Emotional Guardedness",
    exposureFear: "Exposure Fear",
    validationNeed: "Validation Need",
    validationSeeking: "Validation Seeking",
    darkCuriosity: "Shadow Curiosity",
    trustSensitivity: "Trust Sensitivity",
    Introversion: "Introversion",
    Extraversion: "Extraversion",
    Intuition: "Intuition",
    Sensing: "Sensing",
    Thinking: "Thinking",
    Feeling: "Feeling",
    Judging: "Judging",
    Perceiving: "Perceiving"
  };
  const RESERVED = new Set(COGNITIVE_FUNCTIONS.concat(["Introversion", "Extraversion", "Intuition", "Sensing", "Thinking", "Feeling", "Judging", "Perceiving", "confidence"]));

  function clampPotentialValue(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.max(0, Math.min(100, Math.round(numeric)));
  }

  function labelFor(key) {
    return LABELS[key] || String(key).replace(/([A-Z])/g, " $1").trim();
  }

  function mergeSignals(target, source) {
    Object.entries(source || {}).forEach(function (entry) {
      const key = entry[0];
      const value = Number(entry[1]);
      if (!Number.isFinite(value)) return;
      target[key] = Math.max(Number(target[key]) || 0, clampPotentialValue(value));
    });
  }

  function collectSignals(result) {
    const signals = {};
    mergeSignals(signals, result && result.traits);
    mergeSignals(signals, result && result.traitScores);
    mergeSignals(signals, result && result.cognitiveFunctions);
    mergeSignals(signals, result && result.functionScores);
    mergeSignals(signals, result && result.eq);

    Object.entries((result && result.functionRatios) || {}).forEach(function (entry) {
      signals[entry[0]] = Math.max(Number(signals[entry[0]]) || 0, clampPotentialValue(Number(entry[1]) * 100));
    });

    const metrics = (result && result.metrics) || {};
    if (Number.isFinite(Number(metrics.I))) {
      signals.Introversion = clampPotentialValue(metrics.I);
      signals.Extraversion = clampPotentialValue(100 - Number(metrics.I));
    }
    if (Number.isFinite(Number(metrics.N))) {
      signals.Intuition = clampPotentialValue(metrics.N);
      signals.Sensing = clampPotentialValue(100 - Number(metrics.N));
    }
    if (Number.isFinite(Number(metrics.T))) {
      signals.Thinking = clampPotentialValue(metrics.T);
      signals.Feeling = clampPotentialValue(100 - Number(metrics.T));
    }
    if (Number.isFinite(Number(metrics.J))) {
      signals.Judging = clampPotentialValue(metrics.J);
      signals.Perceiving = clampPotentialValue(100 - Number(metrics.J));
    }

    const confidence = result && (typeof result.confidence === "object" ? result.confidence.score : result.confidenceScore || result.modelConfidence || result.confidence);
    if (Number.isFinite(Number(confidence))) signals.confidence = clampPotentialValue(confidence);
    return signals;
  }

  function hasSignal(result, signals) {
    const answers = Number((result && (result.answeredCount || result.answersUsed || (result.answers && result.answers.length) || (result.meta && result.meta.answersUsed))) || 0);
    const neutral = ["I", "N", "T", "J"].every(function (key) {
      return Math.round(Number(result && result.metrics && result.metrics[key]) || 50) === 50;
    });
    return answers > 0 ||
      Object.keys((result && result.traits) || {}).length > 0 ||
      Object.keys((result && result.traitScores) || {}).length > 0 ||
      COGNITIVE_FUNCTIONS.some(function (key) { return Number(signals[key]) > 0; }) ||
      Boolean(result && result.type && result.type !== "UNCL" && !neutral);
  }

  function scoreField(rule, signals) {
    let weighted = 0;
    let total = 0;
    Object.entries(rule.weights || {}).forEach(function (entry) {
      const key = entry[0];
      const weight = Number(entry[1]) || 0;
      if (!Number.isFinite(Number(signals[key]))) return;
      weighted += clampPotentialValue(signals[key]) * weight;
      total += Math.abs(weight);
    });
    return total ? clampPotentialValue(weighted / total) : 0;
  }

  function formatList(items) {
    const unique = Array.from(new Set((items || []).filter(Boolean)));
    if (unique.length <= 1) return unique[0] || "your answer pattern";
    if (unique.length === 2) return unique[0] + " and " + unique[1];
    return unique.slice(0, -1).join(", ") + ", and " + unique[unique.length - 1];
  }

  function topDrivers(rule, signals) {
    return Object.entries(rule.weights || {})
      .map(function (entry) {
        const key = entry[0];
        const weight = Number(entry[1]) || 0;
        const value = Number(signals[key]) || 0;
        return { key: key, label: labelFor(key), value: clampPotentialValue(value), contribution: value * weight };
      })
      .filter(function (item) { return item.value > 0 && item.contribution > 0; })
      .sort(function (a, b) { return b.contribution - a.contribution; });
  }

  function evidenceForField(result, rule) {
    const keys = new Set(Object.keys(rule.weights || {}));
    return ((result && result.reasonTrail) || [])
      .filter(function (item) { return keys.has(item.trait); })
      .sort(function (a, b) { return Math.abs(Number(b.impact) || 0) - Math.abs(Number(a.impact) || 0); })
      .slice(0, 4)
      .map(function (item) {
        return {
          trait: item.trait,
          label: item.label || labelFor(item.trait),
          question: item.question,
          answer: item.optionText || item.answer,
          impact: item.impact
        };
      });
  }

  function buildField(rule, result, signals) {
    const score = scoreField(rule, signals);
    const drivers = topDrivers(rule, signals).slice(0, 3);
    const reason = drivers.length
      ? formatList(drivers.map(function (item) { return item.label.toLowerCase(); })) + " made this scope score higher in the answer model."
      : "This scope has limited evidence so far.";
    return {
      id: rule.id,
      title: rule.title,
      shortTitle: rule.shortTitle,
      score: score,
      color: rule.color,
      reason: reason,
      roles: rule.roles,
      action: rule.action,
      drivers: drivers,
      evidence: evidenceForField(result, rule)
    };
  }

  function topTraitSignals(signals) {
    return Object.entries(signals)
      .filter(function (entry) { return !RESERVED.has(entry[0]) && Number(entry[1]) > 0; })
      .sort(function (a, b) { return Number(b[1]) - Number(a[1]); })
      .slice(0, 8)
      .map(function (entry) { return { key: entry[0], label: labelFor(entry[0]), score: clampPotentialValue(entry[1]) }; });
  }

  function topFunctionSignal(signals) {
    return COGNITIVE_FUNCTIONS
      .map(function (key) { return { key: key, label: labelFor(key), score: clampPotentialValue(signals[key] || 0) }; })
      .sort(function (a, b) { return b.score - a.score; })[0];
  }

  function buildStrengths(result, signals, topFields) {
    const field = topFields[0];
    const trait = topTraitSignals(signals)[0];
    const fn = topFunctionSignal(signals);
    const strengths = [];
    if (field) strengths.push(field.shortTitle + " is your highest-scope zone; it should compound faster when the task involves " + field.action + ".");
    if (trait) strengths.push(trait.label + " is one of your strongest signals, so use it as a repeatable advantage instead of a mood-based guess.");
    if (fn && fn.score > 0) strengths.push(fn.label + " is the strongest cognitive signal in this result, which helps explain the direction of your best-fit fields.");
    return strengths.slice(0, 3);
  }

  function buildRisks(result, signals, topFields) {
    const risks = [];
    function push(condition, text) {
      if (condition && risks.indexOf(text) === -1) risks.push(text);
    }
    push(signals.autonomy >= 70 && signals.attachmentNeed >= 70, "Strong independence and connection needs can pull against each other, so define closeness and boundaries clearly.");
    push(signals.controlNeed >= 65 && signals.noveltySeeking >= 60, "A need for control plus novelty can create stop-start momentum; decide which changes are worth acting on before switching direction.");
    push(signals.logicalDetachment >= 65 && (signals.emotionalDepth || signals.empathy || 0) < 55, "Logic may move faster than emotional check-ins under pressure; add one people-impact review before final calls.");
    push(signals.emotionalGuardedness >= 65 || signals.exposureFear >= 65, "You may keep strain private for too long; share small status updates before pressure turns into distance.");
    push(signals.validationNeed >= 65 || signals.validationSeeking >= 65, "Recognition can affect momentum; measure progress by output quality, not only by outside reaction.");
    push(signals.darkCuriosity >= 70 && signals.trustSensitivity >= 60, "Reading hidden motives can be useful, but over-scanning may make neutral behavior look suspicious.");

    const contradictions = (result && (result.contradictions || (result.contradictionSummary && result.contradictionSummary.contradictions))) || [];
    contradictions.slice(0, 2).forEach(function (item) {
      const text = item.description || String(item);
      if (text && risks.length < 3) risks.push(text);
    });
    if (!risks.length && topFields[0]) risks.push("Your main growth risk is overusing " + topFields[0].shortTitle.toLowerCase() + " when the situation needs a different mode.");
    if (risks.length < 2 && topFields[1]) risks.push("Balance " + topFields[0].shortTitle.toLowerCase() + " with " + topFields[1].shortTitle.toLowerCase() + " so your profile stays flexible.");
    return risks.slice(0, 3);
  }

  function buildPlan(signals, topFields) {
    const field = topFields[0];
    const trait = topTraitSignals(signals)[0];
    if (!field) return [];
    return [
      "Days 1-7: Pick one " + field.shortTitle.toLowerCase() + " task and define a visible outcome before starting.",
      "Days 8-18: Use " + (trait ? trait.label.toLowerCase() : "your strongest trait") + " deliberately, then ask for one concrete feedback point.",
      "Days 19-30: Build a simple review loop so your strongest pattern becomes a habit, not only a one-time result."
    ];
  }

  function normalizeExistingPotential(potential, result) {
    if (!potential || !Array.isArray(potential.topFields) || !potential.topFields.length) return null;
    const topFields = potential.topFields.map(function (field) {
      return {
        id: field.id || field.title,
        title: field.title || "Potential field",
        shortTitle: field.shortTitle || field.title || "Potential",
        score: clampPotentialValue(field.score),
        color: field.color || "#2563eb",
        reason: field.reason || "This field was generated from your answer-weighted report.",
        roles: Array.isArray(field.roles) ? field.roles : [],
        action: field.action || "using your strongest answer patterns",
        drivers: field.drivers || [],
        evidence: field.evidence || []
      };
    });
    const top = topFields[0];
    return {
      type: potential.type || (result && result.type) || "UNCL",
      headline: potential.headline || top.shortTitle + " has the highest current scope",
      focus: potential.focus || top.title,
      focusScore: clampPotentialValue(potential.focusScore || top.score),
      confidence: clampPotentialValue(potential.confidence || (result && result.confidenceScore) || 0),
      userLine: potential.userLine || "Your answers currently point most strongly toward " + top.title.toLowerCase() + ".",
      connectiveCopy: potential.connectiveCopy || "This potential map is calculated from your saved answer report.",
      topFields: topFields,
      strengths: potential.strengths || [],
      risks: potential.risks || [],
      growthPlan: potential.growthPlan || [],
      scope: potential.scope || { focus: top.title, score: top.score, fields: topFields.map(function (field) { return { id: field.id, title: field.title, score: field.score }; }) },
      generatedFrom: potential.generatedFrom || "api-report"
    };
  }

  function buildPotentialProfile(result) {
    const existing = normalizeExistingPotential(result && result.potential, result);
    if (existing) return existing;
    const signals = collectSignals(result || {});
    if (!hasSignal(result || {}, signals)) return null;

    const topFields = COGNILENS_FIELD_RULES
      .map(function (rule) { return buildField(rule, result || {}, signals); })
      .filter(function (field) { return field.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 6);
    if (!topFields.length) return null;

    const top = topFields[0];
    const answerCount = Number((result && (result.answeredCount || result.answersUsed || (result.answers && result.answers.length) || (result.meta && result.meta.answersUsed))) || 0);
    return {
      type: (result && result.type) || "UNCL",
      headline: top.shortTitle + " has the highest current scope",
      focus: top.title,
      focusScore: top.score,
      confidence: clampPotentialValue(result && (result.confidenceScore || result.modelConfidence || result.confidence)),
      userLine: "Your answers currently point most strongly toward " + top.title.toLowerCase() + ".",
      connectiveCopy: "Based on " + answerCount + " answer signals, " + top.shortTitle.toLowerCase() + " is the area where effort is most likely to compound. This is a potential estimate, not a fixed limit.",
      topFields: topFields,
      strengths: buildStrengths(result || {}, signals, topFields),
      risks: buildRisks(result || {}, signals, topFields),
      growthPlan: buildPlan(signals, topFields),
      scope: { focus: top.title, score: top.score, fields: topFields.map(function (field) { return { id: field.id, title: field.title, score: field.score }; }) },
      generatedFrom: "answer-weighted-browser-report"
    };
  }

  window.COGNILENS_FIELD_RULES = COGNILENS_FIELD_RULES;
  window.COGNILENS_TYPE_POTENTIAL = {};
  window.getCogniLensPotential = buildPotentialProfile;
})();
