const EQ_TOTAL_IDS = [
  "EQ1", "EQ2", "EQ3", "EQ4", "EQ5",
  "EQ6", "EQ8", "EQ9", "EQ10", "EQ11", "EQ12", "EQ13",
  "EQ14", "EQ15", "EQ16", "EQ17", "EQ18", "EQ19", "EQ20"
];

const PHASE_THREE_IDS = ["EQ14", "EQ15", "EQ16", "EQ17", "EQ18", "EQ19", "EQ20"];

const MORAL_TRAIT_LABELS = {
  empathy: "Empathy",
  logic: "Logic",
  justice: "Justice",
  compassion: "Compassion",
  honesty: "Honesty",
  attachment: "Attachment",
  sacrifice: "Sacrifice",
  selfPreserve: "Self-preservation"
};

const BEHAVIOR_TRAITS = {
  envy: { label: "Envy", group: "Shadow", color: "#7c3aed", copy: "Comparison discomfort when someone close or similar moves ahead." },
  greed: { label: "Greed / Self-Priority", group: "Shadow", color: "#ea580c", copy: "Self-benefit and self-preservation pressure when others also need something." },
  lust: { label: "Lust / Romantic Impulse", group: "Shadow", color: "#db2777", copy: "Impulse to impress, attract, or seek romantic validation." },
  egoControl: { label: "Ego Control", group: "Self", color: "#0f766e", copy: "Ability to stay grounded without proving superiority." },
  authenticity: { label: "Authenticity", group: "Identity", color: "#2563eb", copy: "How directly your answers show the real self instead of a performed version." },
  impressionManagement: { label: "Image Management", group: "Identity", color: "#9333ea", copy: "Tendency to shape how others see you." },
  validationSeeking: { label: "Validation Seeking", group: "Social", color: "#f43f5e", copy: "Need for approval, admiration, or positive social response." },
  socialAdaptability: { label: "Social Adaptability", group: "Social", color: "#06b6d4", copy: "Ability to adjust communication style to the situation." },
  attachmentIntensity: { label: "Attachment Intensity", group: "Bond", color: "#ec4899", copy: "How strongly emotional bonds remain active after uncertainty or loss." },
  closureSeeking: { label: "Closure Seeking", group: "Bond", color: "#6366f1", copy: "Drive to understand what happened and resolve emotional uncertainty." },
  rumination: { label: "Rumination", group: "Stress", color: "#64748b", copy: "Looping back through memories, causes, or old signals." },
  avoidance: { label: "Avoidance", group: "Defense", color: "#94a3b8", copy: "Tendency to step away from emotional discomfort instead of facing it directly." },
  directCommunication: { label: "Direct Communication", group: "Expression", color: "#0891b2", copy: "Preference for clarity instead of indirect or delayed emotional signaling." },
  emotionalRegulation: { label: "Emotional Regulation", group: "Stability", color: "#16a34a", copy: "Ability to pause, process, and respond without being controlled by the emotion." },
  impulseControl: { label: "Impulse Control", group: "Stability", color: "#475569", copy: "Ability to stop the first urge from becoming the action." },
  resilience: { label: "Resilience", group: "Recovery", color: "#22c55e", copy: "Ability to move forward after emotional impact." },
  empathy: { label: "Empathy", group: "Moral", color: "#8b5cf6", copy: "Sensitivity to emotional and human impact." },
  compassion: { label: "Compassion", group: "Moral", color: "#14b8a6", copy: "Care for dignity and suffering, even when judgment is difficult." },
  logic: { label: "Logic", group: "Moral", color: "#0ea5e9", copy: "Preference for structured reasoning and outcome calculation." },
  consequentialThinking: { label: "Consequence Thinking", group: "Moral", color: "#0284c7", copy: "Attention to scale, outcomes, and downstream impact." },
  justice: { label: "Justice Strictness", group: "Moral", color: "#dc2626", copy: "Preference for accountability, punishment, and moral boundaries." },
  honesty: { label: "Honesty", group: "Integrity", color: "#2563eb", copy: "Commitment to truth even when truth is uncomfortable." },
  truthCourage: { label: "Truth Courage", group: "Integrity", color: "#1d4ed8", copy: "Willingness to speak truth when there is personal or social cost." },
  guiltSensitivity: { label: "Guilt Sensitivity", group: "Integrity", color: "#f97316", copy: "How strongly guilt pushes you toward confession or repair." },
  ideologicalTolerance: { label: "Ideological Tolerance", group: "Relationship", color: "#65a30d", copy: "Capacity to stay connected despite deep value differences." },
  boundaryStrength: { label: "Boundary Strength", group: "Relationship", color: "#4f46e5", copy: "Ability to choose limits when values, truth, or safety are at stake." },
  attachment: { label: "Attachment Pull", group: "Relationship", color: "#be185d", copy: "How much important relationships influence honesty and decision-making." },
  sacrifice: { label: "Sacrifice Tendency", group: "Moral", color: "#059669", copy: "Willingness to absorb personal cost for other people's happiness." },
  selfPreservation: { label: "Self-Preservation", group: "Defense", color: "#111827", copy: "Drive to protect your own stability, safety, or happiness." },
  innerConflict: { label: "Inner Conflict", group: "Consistency", color: "#f59e0b", copy: "Contradiction between values across similar moral situations." }
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
}

function createMoralScores() {
  return {
    empathy: 0,
    logic: 0,
    justice: 0,
    compassion: 0,
    honesty: 0,
    attachment: 0,
    sacrifice: 0,
    selfPreserve: 0
  };
}

function createTraitState() {
  return Object.keys(BEHAVIOR_TRAITS).reduce((state, key) => {
    state[key] = { weighted: 0, weight: 0, notes: [] };
    return state;
  }, {});
}

function normalizeAnswer(answer) {
  return String(answer?.optionText || "").trim().toLowerCase();
}

function buildAnswerMap(answers) {
  return answers.reduce((map, answer) => {
    if (answer?.questionId) map[answer.questionId] = answer;
    return map;
  }, {});
}

function optionIndex(answerMap, id) {
  const value = answerMap[id]?.optionIndex;
  return Number.isInteger(value) ? value : -1;
}

function answerText(answerMap, id) {
  return normalizeAnswer(answerMap[id]);
}

function addSignal(state, key, direction, weight, note) {
  if (!state[key]) return;
  const cleanWeight = Math.abs(Number(weight) || 0);
  state[key].weighted += Math.max(-1, Math.min(1, direction)) * cleanWeight;
  state[key].weight += cleanWeight;
  if (note && state[key].notes.length < 4) state[key].notes.push(note);
}

function addMany(state, signals, note) {
  signals.forEach(([key, direction, weight]) => addSignal(state, key, direction, weight, note));
}

function getDominant(scores) {
  return Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
}

function getMoralType(scores) {
  if (scores.empathy > scores.logic && scores.compassion > scores.justice) return "Emotion-Driven Empath";
  if (scores.logic > scores.empathy && scores.justice > scores.compassion) return "Rational Decision Maker";
  if (scores.honesty > scores.attachment) return "Truth-Oriented Personality";
  if (scores.sacrifice > scores.selfPreserve) return "Self-Sacrificing Nature";
  return "Balanced Moral Thinker";
}

function scorePhaseOne(answerMap, state) {
  const q1 = optionIndex(answerMap, "EQ1");
  if (q1 === 0) addMany(state, [["rumination", 1, 1], ["attachmentIntensity", 1, 0.75], ["closureSeeking", 1, 0.65]], "Reads old messages first");
  if (q1 === 1) addMany(state, [["attachmentIntensity", 1, 0.9], ["impulseControl", -1, 0.75], ["emotionalRegulation", -1, 0.45]], "Feels like replying immediately");
  if (q1 === 2) addMany(state, [["emotionalRegulation", 1, 1], ["impulseControl", 1, 0.85], ["avoidance", 1, 0.45], ["resilience", 1, 0.45]], "Puts phone aside before reacting");

  const q2 = optionIndex(answerMap, "EQ2");
  if (q2 === 0) addMany(state, [["closureSeeking", 1, 1], ["rumination", 1, 0.75], ["logic", 1, 0.35]], "Tries to locate where things changed");
  if (q2 === 1) addMany(state, [["emotionalRegulation", 1, 0.8], ["authenticity", 1, 0.35], ["attachmentIntensity", 1, 0.35]], "Feels emotion while staying composed");
  if (q2 === 2) addMany(state, [["avoidance", 1, 1], ["emotionalRegulation", -1, 0.35], ["resilience", 1, 0.2]], "Wants distraction from the thought");

  const q3 = optionIndex(answerMap, "EQ3");
  if (q3 === 0) addMany(state, [["directCommunication", 1, 1], ["truthCourage", 1, 0.55], ["closureSeeking", 1, 0.6]], "Asks directly for clarity");
  if (q3 === 1) addMany(state, [["emotionalRegulation", 1, 1], ["impulseControl", 1, 0.85], ["directCommunication", -1, 0.2]], "Waits until emotions settle");
  if (q3 === 2) addMany(state, [["directCommunication", 1, 0.55], ["boundaryStrength", 1, 0.45], ["emotionalRegulation", 1, 0.4]], "Sends a short simple message");

  const q4 = optionIndex(answerMap, "EQ4");
  if (q4 === 0) addMany(state, [["empathy", 1, 1], ["compassion", 1, 0.65], ["attachmentIntensity", -1, 0.15]], "Tries to understand their perspective");
  if (q4 === 1) addMany(state, [["authenticity", 1, 0.85], ["directCommunication", 1, 0.65], ["attachmentIntensity", 1, 0.35]], "Expresses feelings honestly");
  if (q4 === 2) addMany(state, [["selfPreservation", 1, 0.55], ["boundaryStrength", 1, 0.7], ["avoidance", 1, 0.25], ["emotionalRegulation", 1, 0.35]], "Accepts it with a minimal reply");

  const q5 = optionIndex(answerMap, "EQ5");
  if (q5 === 0) addMany(state, [["closureSeeking", 1, 0.9], ["logic", 1, 0.45], ["rumination", 1, 0.35]], "What happened stays in mind");
  if (q5 === 1) addMany(state, [["emotionalRegulation", 1, 0.55], ["attachmentIntensity", 1, 0.45], ["authenticity", 1, 0.35]], "Own emotions stay most present");
  if (q5 === 2) addMany(state, [["resilience", 1, 1], ["selfPreservation", 1, 0.45], ["avoidance", -1, 0.15]], "Letting go and moving forward stays most present");
}

function scorePhaseTwo(answerMap, state) {
  if (answerText(answerMap, "EQ6") === "yes") addMany(state, [["envy", 1, 1.2], ["egoControl", -1, 0.45], ["rumination", 1, 0.35]], "Admits jealousy when a close friend moves ahead");
  if (answerText(answerMap, "EQ6") === "no") addMany(state, [["envy", -1, 0.9], ["egoControl", 1, 0.65], ["emotionalRegulation", 1, 0.25]], "Does not report jealousy toward a close friend");

  if (answerText(answerMap, "EQ8") === "more honest") addMany(state, [["honesty", 1, 1], ["truthCourage", 1, 0.9], ["authenticity", 1, 0.55]], "Safety increases honesty");
  if (answerText(answerMap, "EQ8") === "more careful") addMany(state, [["selfPreservation", 1, 0.65], ["socialAdaptability", 1, 0.55], ["impressionManagement", 1, 0.35], ["honesty", -1, 0.35]], "Safety still creates caution");

  if (answerText(answerMap, "EQ9") === "yes") addMany(state, [["impressionManagement", 1, 1.1], ["validationSeeking", 1, 0.95], ["authenticity", -1, 0.6], ["egoControl", -1, 0.35]], "Tries to appear more perfect");
  if (answerText(answerMap, "EQ9") === "no") addMany(state, [["authenticity", 1, 0.95], ["egoControl", 1, 0.55], ["impressionManagement", -1, 0.4]], "Does not report perfection performance");

  const q10 = optionIndex(answerMap, "EQ10");
  if (q10 === 0) addMany(state, [["validationSeeking", 1, 0.8], ["lust", 1, 0.7], ["impressionManagement", 1, 0.7], ["authenticity", -1, 0.25]], "Would act cool and confident for a crush");
  if (q10 === 1) addMany(state, [["validationSeeking", 1, 0.95], ["impressionManagement", 1, 0.85], ["lust", 1, 0.45], ["greed", 1, 0.22], ["egoControl", -1, 0.25]], "Would show strengths or achievements");
  if (q10 === 2) addMany(state, [["authenticity", 1, 1], ["egoControl", 1, 0.55], ["lust", -1, 0.25], ["validationSeeking", -1, 0.25]], "Would talk normally with a crush");
  if (q10 === 3) addMany(state, [["empathy", 1, 0.65], ["socialAdaptability", 1, 0.65], ["attachment", 1, 0.35], ["lust", 1, 0.25]], "Would understand their interests and spend time");

  if (answerText(answerMap, "EQ11") === "i am completely real") addMany(state, [["authenticity", 1, 1], ["socialAdaptability", -1, 0.2], ["impressionManagement", -1, 0.25]], "Stays completely real with new people");
  if (answerText(answerMap, "EQ11") === "i adjust a little depending on the situation") addMany(state, [["socialAdaptability", 1, 1], ["impressionManagement", 1, 0.45], ["authenticity", -1, 0.2]], "Adjusts slightly around new people");

  if (answerText(answerMap, "EQ12") === "yes") addMany(state, [["ideologicalTolerance", 1, 1], ["attachment", 1, 0.4], ["boundaryStrength", -1, 0.2]], "Would stay despite different political views");
  if (answerText(answerMap, "EQ12") === "no") addMany(state, [["boundaryStrength", 1, 0.75], ["selfPreservation", 1, 0.45], ["ideologicalTolerance", -1, 0.35]], "Would not stay with completely different political views");

  if (answerText(answerMap, "EQ13") === "yes") addMany(state, [["honesty", 1, 1], ["truthCourage", 1, 1], ["authenticity", 1, 0.55], ["attachment", -1, 0.2]], "Would be fully honest even if someone important could leave");
  if (answerText(answerMap, "EQ13") === "no") addMany(state, [["attachment", 1, 0.75], ["selfPreservation", 1, 0.55], ["honesty", -1, 0.45], ["truthCourage", -1, 0.5]], "May protect connection over full honesty");
}

function scorePhaseThree(answerMap, state, moralScores) {
  let contradiction = 0;

  if (answerText(answerMap, "EQ14") === "yes") {
    moralScores.empathy += 2;
    addMany(state, [["empathy", 1, 0.65], ["compassion", 1, 0.35]], "Chooses child over elderly person");
  } else if (answerText(answerMap, "EQ14") === "no") {
    moralScores.logic += 2;
    addMany(state, [["logic", 1, 0.55], ["consequentialThinking", 1, 0.35]], "Does not automatically choose child");
  }

  if (answerText(answerMap, "EQ15") === "yes") {
    moralScores.logic += 3;
    addMany(state, [["logic", 1, 0.85], ["consequentialThinking", 1, 1], ["empathy", -1, 0.15]], "Chooses five children over one elderly person");
  } else if (answerText(answerMap, "EQ15") === "no") {
    moralScores.empathy += 2;
    addMany(state, [["empathy", 1, 0.55], ["compassion", 1, 0.4], ["logic", -1, 0.2]], "Does not reduce the choice to numbers");
  }

  if (answerText(answerMap, "EQ16") === "yes") {
    moralScores.empathy += 3;
    addMany(state, [["empathy", 1, 0.9], ["compassion", 1, 0.45]], "Still chooses one child over five elderly people");
  } else if (answerText(answerMap, "EQ16") === "no") {
    moralScores.logic += 2;
    addMany(state, [["logic", 1, 0.65], ["consequentialThinking", 1, 0.55]], "Chooses five elderly people over one child");
  }

  if (answerText(answerMap, "EQ15") === "yes" && answerText(answerMap, "EQ16") === "yes") {
    contradiction += 1;
    addSignal(state, "innerConflict", 1, 1, "Numbers logic and child-priority both selected");
  }

  if (answerText(answerMap, "EQ17") === "yes") {
    moralScores.compassion += 3;
    addMany(state, [["compassion", 1, 1], ["justice", -1, 0.4]], "Grants right to live even after serious crime");
  } else if (answerText(answerMap, "EQ17") === "no") {
    moralScores.justice += 3;
    addMany(state, [["justice", 1, 1], ["compassion", -1, 0.25], ["boundaryStrength", 1, 0.45]], "Justice boundary overrides right-to-live question");
  }

  if (answerText(answerMap, "EQ18") === "yes") {
    moralScores.honesty += 3;
    addMany(state, [["honesty", 1, 1], ["guiltSensitivity", 1, 0.65], ["truthCourage", 1, 0.45]], "Would tell parents the truth after hurting them");
  } else if (answerText(answerMap, "EQ18") === "no") {
    moralScores.attachment += 2;
    addMany(state, [["attachment", 1, 0.55], ["selfPreservation", 1, 0.4], ["honesty", -1, 0.35]], "May hide truth from parents after harm");
  }

  if (answerText(answerMap, "EQ19") === "yes") {
    moralScores.honesty += 3;
    addMany(state, [["honesty", 1, 0.85], ["truthCourage", 1, 1], ["compassion", -1, 0.3]], "Would tell truth even if it destroys a life");
  } else if (answerText(answerMap, "EQ19") === "no") {
    moralScores.compassion += 2;
    addMany(state, [["compassion", 1, 0.7], ["consequentialThinking", 1, 0.55], ["honesty", -1, 0.35]], "Would hold truth back to prevent destruction");
  }

  if (answerText(answerMap, "EQ18") === "yes" && answerText(answerMap, "EQ19") === "no") {
    contradiction += 1;
    addSignal(state, "innerConflict", 1, 1, "Truth is selected for parents but withheld for severe consequence");
  }

  if (answerText(answerMap, "EQ20") === "yes") {
    moralScores.sacrifice += 3;
    addMany(state, [["sacrifice", 1, 1], ["compassion", 1, 0.45], ["greed", -1, 0.8], ["selfPreservation", -1, 0.35]], "Would sacrifice own happiness for multiple people");
  } else if (answerText(answerMap, "EQ20") === "no") {
    moralScores.selfPreserve += 3;
    addMany(state, [["selfPreservation", 1, 1], ["greed", 1, 0.75], ["sacrifice", -1, 0.6], ["boundaryStrength", 1, 0.35]], "Would not sacrifice own happiness for multiple people");
  }

  return contradiction;
}

function finalizeTraits(state, consistency, answeredCount) {
  return Object.entries(state).map(([key, item]) => {
    const normalized = item.weight ? item.weighted / item.weight : 0;
    const shrink = item.weight / (item.weight + 3);
    const score = clamp(50 + 50 * normalized * shrink);
    const confidence = clamp(28 + item.weight * 9 + answeredCount * 1.6 + consistency * 0.18, 0, 96);
    return {
      key,
      label: BEHAVIOR_TRAITS[key].label,
      group: BEHAVIOR_TRAITS[key].group,
      color: BEHAVIOR_TRAITS[key].color,
      description: BEHAVIOR_TRAITS[key].copy,
      score,
      confidence,
      evidenceWeight: Number(item.weight.toFixed(2)),
      evidence: item.notes
    };
  }).sort((a, b) => b.score - a.score);
}

function scoreEQ(answers) {
  const safeAnswers = Array.isArray(answers) ? answers : [];
  const answerMap = buildAnswerMap(safeAnswers);
  const moralScores = createMoralScores();
  const traitState = createTraitState();

  scorePhaseOne(answerMap, traitState);
  scorePhaseTwo(answerMap, traitState);
  const contradiction = scorePhaseThree(answerMap, traitState, moralScores);

  const answeredCount = EQ_TOTAL_IDS.filter((id) => answerMap[id]).length;
  const missing = PHASE_THREE_IDS.filter((id) => !answerMap[id]);
  const consistency = Math.max(0, 100 - contradiction * 20);
  const dominantTrait = getDominant(moralScores);
  const moralType = getMoralType(moralScores);
  const behavioralTraits = finalizeTraits(traitState, consistency, answeredCount);
  const traitScores = behavioralTraits.reduce((map, trait) => {
    map[trait.key] = trait.score;
    return map;
  }, {});
  const topTraits = behavioralTraits.slice(0, 5);
  const shadowTraits = behavioralTraits.filter((trait) => ["envy", "greed", "lust", "impressionManagement", "validationSeeking", "innerConflict"].includes(trait.key));
  const avgTraitConfidence = behavioralTraits.reduce((sum, trait) => sum + trait.confidence, 0) / Math.max(behavioralTraits.length, 1);
  const coverage = (answeredCount / EQ_TOTAL_IDS.length) * 100;
  const modelConfidence = clamp(coverage * 0.46 + consistency * 0.34 + avgTraitConfidence * 0.2 - contradiction * 5);
  const profileType = topTraits[0]?.label ? `${topTraits[0].label} Dominant Profile` : moralType;

  const result = {
    type: moralType,
    profileType,
    score: consistency,
    summary: `${profileType}. Top signals: ${topTraits.slice(0, 3).map((trait) => `${trait.label} ${trait.score}%`).join(", ")}. Model confidence: ${modelConfidence}%.`,
    dominantTrait,
    dominantTraitLabel: MORAL_TRAIT_LABELS[dominantTrait],
    moralType,
    consistency,
    contradiction,
    missing,
    modelConfidence,
    answeredCount,
    totalQuestions: EQ_TOTAL_IDS.length,
    raw: moralScores,
    moralScores,
    traitScores,
    behavioralTraits,
    shadowTraits,
    topTraits,
    algorithm: {
      method: "Weighted multi-trait evidence with neutral baseline and Bayesian shrinkage",
      formula: "score = 50 + 50 * (weightedSignal / evidenceWeight) * (evidenceWeight / (evidenceWeight + 3))",
      confidence: "coverage * 0.46 + consistency * 0.34 + averageTraitConfidence * 0.20 - contradictions * 5"
    },
    traits: behavioralTraits
  };

  if (consistency < 60) {
    result.flag = "High internal contradiction detected";
  }

  return result;
}

window.scoreCogniLensEQ = function scoreCogniLensEQ(answers) {
  return scoreEQ(answers);
};
