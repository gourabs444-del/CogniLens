const EQ_TOTAL_IDS = [
  "EQ1", "EQ2", "EQ3", "EQ4", "EQ5",
  "EQ6", "EQ7", "EQ8", "EQ9", "EQ10",
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
  if (q1 === 0) addMany(state, [["impressionManagement", 1, 0.8], ["boundaryStrength", 1, 0.55], ["selfPreservation", 1, 0.35]], "Sees charm as emotionally dangerous");
  if (q1 === 1) addMany(state, [["empathy", 1, 0.45], ["logic", -1, 0.35], ["attachmentIntensity", 1, 0.25]], "Feels excessive logic can be emotionally unsafe");
  if (q1 === 2) addMany(state, [["emotionalRegulation", 1, 0.75], ["boundaryStrength", 1, 0.5], ["avoidance", 1, 0.25]], "Feels emotional intensity can become dangerous");
  if (q1 === 3) addMany(state, [["closureSeeking", 1, 0.75], ["rumination", 1, 0.6], ["selfPreservation", 1, 0.25]], "Feels quiet people are emotionally hard to read");

  const q2 = optionIndex(answerMap, "EQ2");
  if (q2 === 0) addMany(state, [["attachmentIntensity", 1, 0.7], ["innerConflict", 1, 0.45], ["resilience", 1, 0.25]], "Drawn to thunderstorm-like emotional intensity");
  if (q2 === 1) addMany(state, [["selfPreservation", 1, 0.55], ["rumination", 1, 0.45], ["emotionalRegulation", 1, 0.25]], "Drawn to cold, contained emotional weather");
  if (q2 === 2) addMany(state, [["resilience", 1, 0.85], ["emotionalRegulation", 1, 0.55], ["avoidance", -1, 0.2]], "Drawn to bright and open emotional weather");
  if (q2 === 3) addMany(state, [["closureSeeking", 1, 0.65], ["rumination", 1, 0.55], ["logic", 1, 0.25]], "Drawn to foggy, ambiguous emotional weather");

  const q3 = optionIndex(answerMap, "EQ3");
  if (q3 === 0) addMany(state, [["impressionManagement", 1, 0.75], ["validationSeeking", 1, 0.65], ["authenticity", -1, 0.2]], "Being judged feels uncomfortable");
  if (q3 === 1) addMany(state, [["attachmentIntensity", 1, 0.8], ["validationSeeking", 1, 0.7], ["avoidance", -1, 0.2]], "Being ignored feels uncomfortable");
  if (q3 === 2) addMany(state, [["boundaryStrength", 1, 0.9], ["selfPreservation", 1, 0.65], ["egoControl", 1, 0.3]], "Being controlled feels uncomfortable");
  if (q3 === 3) addMany(state, [["authenticity", 1, 0.8], ["closureSeeking", 1, 0.65], ["directCommunication", 1, 0.35]], "Being misunderstood feels uncomfortable");

  const q4 = optionIndex(answerMap, "EQ4");
  if (q4 === 0) addMany(state, [["rumination", 1, 0.85], ["impressionManagement", 1, 0.55], ["validationSeeking", 1, 0.25]], "Revisits embarrassing memories");
  if (q4 === 1) addMany(state, [["attachmentIntensity", 1, 0.8], ["empathy", 1, 0.45], ["rumination", 1, 0.35]], "Revisits emotional memories");
  if (q4 === 2) addMany(state, [["closureSeeking", 1, 0.65], ["envy", 1, 0.35], ["resilience", -1, 0.2]], "Revisits missed opportunities");
  if (q4 === 3) addMany(state, [["closureSeeking", 1, 1], ["logic", 1, 0.55], ["rumination", 1, 0.65]], "Revisits unsolved situations");

  const q5 = optionIndex(answerMap, "EQ5");
  if (q5 === 0) addMany(state, [["authenticity", 1, 0.75], ["socialAdaptability", -1, 0.25], ["boundaryStrength", 1, 0.3]], "Drained by fake positivity");
  if (q5 === 1) addMany(state, [["boundaryStrength", 1, 0.8], ["selfPreservation", 1, 0.6], ["attachmentIntensity", -1, 0.25]], "Drained by emotional dependency");
  if (q5 === 2) addMany(state, [["emotionalRegulation", 1, 0.7], ["selfPreservation", 1, 0.5], ["resilience", -1, 0.2]], "Drained by constant unpredictability");
  if (q5 === 3) addMany(state, [["closureSeeking", 1, 0.7], ["authenticity", 1, 0.45], ["resilience", -1, 0.2]], "Drained by lack of meaning");
}
function scorePhaseTwo(answerMap, state) {
  const q6 = optionIndex(answerMap, "EQ6");
  if (q6 === 0) addMany(state, [["validationSeeking", 1, 0.8], ["selfPreservation", 1, 0.35], ["egoControl", -1, 0.25]], "Most affected by being called useless");
  if (q6 === 1) addMany(state, [["authenticity", 1, 0.85], ["impressionManagement", 1, 0.4], ["truthCourage", 1, 0.25]], "Most affected by being called fake");
  if (q6 === 2) addMany(state, [["attachmentIntensity", 1, 0.75], ["validationSeeking", 1, 0.45], ["envy", 1, 0.25]], "Most affected by being called replaceable");
  if (q6 === 3) addMany(state, [["attachment", 1, 0.65], ["validationSeeking", 1, 0.65], ["selfPreservation", -1, 0.15]], "Most affected by being told they do not matter");

  const q7 = optionIndex(answerMap, "EQ7");
  if (q7 === 0) addMany(state, [["boundaryStrength", 1, 0.7], ["attachmentIntensity", -1, 0.25], ["selfPreservation", 1, 0.35]], "Sees emotional dependency as weakness");
  if (q7 === 1) addMany(state, [["logic", 1, 0.85], ["egoControl", 1, 0.35], ["validationSeeking", 1, 0.2]], "Sees lack of intelligence as weakness");
  if (q7 === 2) addMany(state, [["egoControl", 1, 0.75], ["emotionalRegulation", 1, 0.55], ["selfPreservation", 1, 0.25]], "Sees lack of control as weakness");
  if (q7 === 3) addMany(state, [["validationSeeking", -1, 0.55], ["egoControl", 1, 0.45], ["authenticity", 1, 0.25]], "Sees needing validation as weakness");

  const q8 = optionIndex(answerMap, "EQ8");
  if (q8 === 0) addMany(state, [["egoControl", -1, 0.3], ["validationSeeking", 1, 0.45], ["logic", 1, 0.35]], "Feels excited being the most intelligent in the room");
  if (q8 === 1) addMany(state, [["logic", 1, 0.55], ["socialAdaptability", -1, 0.3], ["empathy", -1, 0.2]], "Feels bored being the most intelligent in the room");
  if (q8 === 2) addMany(state, [["rumination", 1, 0.55], ["selfPreservation", 1, 0.45], ["egoControl", 1, 0.2]], "Feels suspicious being the most intelligent in the room");
  if (q8 === 3) addMany(state, [["empathy", 1, 0.65], ["consequentialThinking", 1, 0.55], ["egoControl", 1, 0.35]], "Feels responsible being the most intelligent in the room");

  const q9 = optionIndex(answerMap, "EQ9");
  if (q9 === 0) addMany(state, [["boundaryStrength", 1, 0.9], ["selfPreservation", 1, 0.65], ["attachment", -1, 0.35]], "Disconnects instantly after losing trust");
  if (q9 === 1) addMany(state, [["compassion", 1, 0.65], ["attachment", 1, 0.55], ["boundaryStrength", -1, 0.2]], "Gives one last chance after losing trust");
  if (q9 === 2) addMany(state, [["emotionalRegulation", 1, 0.75], ["boundaryStrength", 1, 0.55], ["attachmentIntensity", -1, 0.25]], "Quietly reduces attachment after trust loss");
  if (q9 === 3) addMany(state, [["logic", 1, 0.65], ["rumination", 1, 0.5], ["closureSeeking", 1, 0.45]], "Mentally tests someone after trust loss");

  const q10 = optionIndex(answerMap, "EQ10");
  if (q10 === 0) addMany(state, [["selfPreservation", 1, 0.65], ["avoidance", 1, 0.45], ["attachmentIntensity", -1, 0.35]], "Feels peace if everyone disappears");
  if (q10 === 1) addMany(state, [["attachmentIntensity", 1, 0.85], ["attachment", 1, 0.55], ["validationSeeking", 1, 0.25]], "Feels empty if everyone disappears");
  if (q10 === 2) addMany(state, [["logic", 1, 0.6], ["closureSeeking", 1, 0.45], ["emotionalRegulation", 1, 0.25]], "Feels curious if everyone disappears");
  if (q10 === 3) addMany(state, [["selfPreservation", 1, 0.7], ["boundaryStrength", 1, 0.55], ["avoidance", 1, 0.2]], "Feels free if everyone disappears");
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

const legacyScoreCogniLensEQ = window.scoreCogniLensEQ;
window.scoreCogniLensEQ = function scoreCogniLensEQ(answers, questions) {
  if (window.CogniLensAPI?.submitTest) {
    return window.CogniLensAPI.submitTest({ testType: "eq", answers, questions });
  }
  return legacyScoreCogniLensEQ(answers, questions);
};