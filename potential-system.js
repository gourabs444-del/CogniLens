/*
 * CogniLens Potential Engine
 * Turns MBTI-style result metrics into field fit, growth paths, and user-facing insight copy.
 */

const COGNILENS_FIELD_RULES = [
  {
    id: "strategy-product",
    title: "Product Strategy & Business Systems",
    shortTitle: "Strategy",
    traits: ["N", "T", "J"],
    color: "#2563eb",
    roles: ["Product strategist", "Business analyst", "Growth planner"],
    skills: ["market mapping", "systems thinking", "decision frameworks"],
    reason: "You can connect patterns, trade-offs, and long-term outcomes into a clear plan."
  },
  {
    id: "software-ai",
    title: "Software, AI Tools & Automation",
    shortTitle: "AI Systems",
    traits: ["N", "T", "I"],
    color: "#7c3aed",
    roles: ["AI builder", "Automation developer", "Technical founder"],
    skills: ["logic building", "tool design", "technical problem solving"],
    reason: "You are likely to enjoy work where abstract ideas become useful systems."
  },
  {
    id: "data-research",
    title: "Data, Research & Analysis",
    shortTitle: "Research",
    traits: ["I", "N", "T"],
    color: "#0ea5e9",
    roles: ["Data analyst", "UX researcher", "Research strategist"],
    skills: ["pattern reading", "evidence review", "structured thinking"],
    reason: "You can slow down, inspect signals, and find the pattern behind noisy information."
  },
  {
    id: "operations",
    title: "Operations, Process & Execution",
    shortTitle: "Operations",
    traits: ["S", "T", "J"],
    color: "#f97316",
    roles: ["Operations manager", "Project coordinator", "Process designer"],
    skills: ["planning", "quality control", "execution discipline"],
    reason: "You can turn unclear work into reliable steps, rules, and delivery rhythm."
  },
  {
    id: "people-leadership",
    title: "Leadership, Coaching & Team Growth",
    shortTitle: "Leadership",
    traits: ["E", "F", "J"],
    color: "#10b981",
    roles: ["Team lead", "Coach", "Community manager"],
    skills: ["communication", "motivation", "group alignment"],
    reason: "You can read people, create direction, and help a group move with confidence."
  },
  {
    id: "design-content",
    title: "Design, Content & Creative Direction",
    shortTitle: "Creative",
    traits: ["N", "F", "P"],
    color: "#ec4899",
    roles: ["Brand designer", "Content strategist", "Creative director"],
    skills: ["taste building", "storytelling", "visual judgement"],
    reason: "You can convert feeling, meaning, and fresh angles into work people remember."
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship, Sales & Growth",
    shortTitle: "Growth",
    traits: ["E", "N", "P"],
    color: "#f59e0b",
    roles: ["Founder", "Growth marketer", "Sales strategist"],
    skills: ["experimentation", "pitching", "opportunity spotting"],
    reason: "You can move through uncertainty, test ideas quickly, and learn from the market."
  },
  {
    id: "education",
    title: "Teaching, Knowledge & Community",
    shortTitle: "Teaching",
    traits: ["N", "F", "J"],
    color: "#14b8a6",
    roles: ["Educator", "Learning designer", "Mentor"],
    skills: ["explanation", "curriculum thinking", "guidance"],
    reason: "You can turn complex ideas into language that helps people feel capable."
  },
  {
    id: "care-service",
    title: "Support, HR & Social Impact",
    shortTitle: "Support",
    traits: ["S", "F", "J"],
    color: "#22c55e",
    roles: ["Support lead", "HR coordinator", "Wellbeing program builder"],
    skills: ["empathy", "detail care", "trust building"],
    reason: "You can notice practical needs and create support that feels dependable."
  },
  {
    id: "field-action",
    title: "Field Work, Practical Ops & Crisis Response",
    shortTitle: "Action",
    traits: ["S", "T", "P"],
    color: "#64748b",
    roles: ["Technical operator", "Event lead", "Crisis responder"],
    skills: ["fast judgement", "hands-on solving", "situational awareness"],
    reason: "You can stay useful when things are moving fast and the answer is not written down."
  }
];

const COGNILENS_TYPE_POTENTIAL = {
  INTJ: {
    fields: ["strategy-product", "software-ai", "data-research", "entrepreneurship"],
    voice: "You are built for high-leverage work: systems, strategy, research, and tools that improve how decisions are made.",
    strengths: ["Long-range planning", "Independent problem solving", "Turning complex ideas into systems"],
    risks: ["Over-perfecting before launch", "Sounding too blunt when the idea feels obvious", "Skipping emotional buy-in"],
    environment: "clear ownership, deep work time, smart constraints, and room to build a better system"
  },
  INTP: {
    fields: ["data-research", "software-ai", "strategy-product", "design-content"],
    voice: "You grow fastest where curiosity is rewarded and the work lets you solve a puzzle instead of repeating a script.",
    strengths: ["Pattern discovery", "Original thinking", "Technical clarity"],
    risks: ["Staying in analysis too long", "Losing interest after the puzzle is solved", "Under-selling your work"],
    environment: "open problems, flexible thinking time, and teammates who value precise reasoning"
  },
  ENTJ: {
    fields: ["strategy-product", "entrepreneurship", "people-leadership", "software-ai"],
    voice: "Your potential rises when you can set direction, organize people, and turn ambition into measurable progress.",
    strengths: ["Strategic leadership", "Decisive execution", "High standards"],
    risks: ["Moving faster than the team can absorb", "Treating emotions as inefficiency", "Overloading yourself with control"],
    environment: "ambitious goals, authority to decide, and visible performance metrics"
  },
  ENTP: {
    fields: ["entrepreneurship", "strategy-product", "software-ai", "design-content"],
    voice: "You are strongest where ideas need to be tested, challenged, rebuilt, and pitched in a fresh way.",
    strengths: ["Idea generation", "Strategic debate", "Fast reframing"],
    risks: ["Starting more than you finish", "Arguing when alignment is needed", "Ignoring routine maintenance"],
    environment: "experiments, smart debate, fast feedback, and freedom to challenge assumptions"
  },
  INFJ: {
    fields: ["education", "people-leadership", "design-content", "data-research"],
    voice: "You create value by seeing the deeper pattern in people and turning it into guidance, meaning, or change.",
    strengths: ["Insight into people", "Purpose-led planning", "Deep communication"],
    risks: ["Carrying too much emotional weight", "Waiting for perfect clarity", "Not stating your needs directly"],
    environment: "mission-led work, thoughtful people, and space to turn insight into action"
  },
  INFP: {
    fields: ["design-content", "education", "care-service", "data-research"],
    voice: "Your best work comes from values, originality, and the ability to express what others feel but cannot yet explain.",
    strengths: ["Authentic storytelling", "Empathy", "Creative meaning-making"],
    risks: ["Taking feedback personally", "Avoiding structure", "Choosing comfort over visibility"],
    environment: "creative freedom, values alignment, and gentle but real deadlines"
  },
  ENFJ: {
    fields: ["people-leadership", "education", "strategy-product", "care-service"],
    voice: "You can create serious impact when people need direction, encouragement, and a shared sense of purpose.",
    strengths: ["Motivating others", "Reading group needs", "Creating shared direction"],
    risks: ["Over-giving", "Avoiding difficult feedback", "Taking responsibility for everyone"],
    environment: "people-centered work, clear mission, and leadership that values emotional intelligence"
  },
  ENFP: {
    fields: ["entrepreneurship", "design-content", "people-leadership", "education"],
    voice: "Your potential expands when you can connect ideas, people, and possibility into something that feels alive.",
    strengths: ["Opportunity spotting", "Creative communication", "Energizing groups"],
    risks: ["Scattered focus", "Avoiding boring follow-through", "Over-promising from excitement"],
    environment: "variety, creative ownership, human connection, and short execution cycles"
  },
  ISTJ: {
    fields: ["operations", "data-research", "strategy-product", "care-service"],
    voice: "You are strongest where reliability, accuracy, and clean process matter more than noise or hype.",
    strengths: ["Consistency", "Detail accuracy", "Process discipline"],
    risks: ["Resisting useful change", "Underestimating creative routes", "Taking too much duty silently"],
    environment: "stable standards, practical goals, and respect for careful execution"
  },
  ISFJ: {
    fields: ["care-service", "operations", "education", "people-leadership"],
    voice: "You create value by noticing what people need and making the environment safer, smoother, and more dependable.",
    strengths: ["Practical care", "Memory for details", "Loyal follow-through"],
    risks: ["People-pleasing", "Avoiding spotlight", "Staying in roles that underuse you"],
    environment: "supportive teams, clear expectations, and work that helps real people"
  },
  ESTJ: {
    fields: ["operations", "people-leadership", "strategy-product", "entrepreneurship"],
    voice: "You grow in environments that need structure, speed, accountability, and someone who can make decisions stick.",
    strengths: ["Execution leadership", "Organization", "Direct accountability"],
    risks: ["Being too rigid", "Missing quieter viewpoints", "Prioritizing control over creativity"],
    environment: "clear hierarchy, measurable outcomes, and responsibility for delivery"
  },
  ESFJ: {
    fields: ["people-leadership", "care-service", "education", "operations"],
    voice: "You are strong where trust, service, and group harmony need to become real-world coordination.",
    strengths: ["Relationship building", "Practical support", "Team rhythm"],
    risks: ["Needing approval too much", "Avoiding conflict", "Overextending for others"],
    environment: "collaborative teams, visible appreciation, and people-first goals"
  },
  ISTP: {
    fields: ["field-action", "software-ai", "operations", "data-research"],
    voice: "Your potential shows up when a real problem needs calm hands, practical logic, and quick adjustment.",
    strengths: ["Hands-on solving", "Calm under pressure", "Efficient troubleshooting"],
    risks: ["Disconnecting emotionally", "Avoiding long-term planning", "Getting bored with routine"],
    environment: "practical autonomy, real tools, and problems that reward skill"
  },
  ISFP: {
    fields: ["design-content", "care-service", "field-action", "education"],
    voice: "You work best when skill, taste, and personal meaning can turn into something people can feel.",
    strengths: ["Aesthetic judgement", "Gentle presence", "Practical creativity"],
    risks: ["Avoiding visibility", "Struggling with harsh systems", "Waiting for motivation"],
    environment: "creative trust, human scale, and room to work with your own style"
  },
  ESTP: {
    fields: ["entrepreneurship", "field-action", "people-leadership", "operations"],
    voice: "You have strong potential in fast-moving spaces where timing, confidence, and real-world action matter.",
    strengths: ["Fast action", "Persuasion", "Situational awareness"],
    risks: ["Ignoring long-term consequences", "Getting bored with planning", "Taking unnecessary risks"],
    environment: "movement, competition, quick feedback, and visible wins"
  },
  ESFP: {
    fields: ["design-content", "entrepreneurship", "people-leadership", "care-service"],
    voice: "You create value when people need energy, taste, emotional presence, and a memorable experience.",
    strengths: ["Social energy", "Experience design", "Warm communication"],
    risks: ["Avoiding structure", "Reacting to mood", "Underestimating preparation"],
    environment: "people, creative action, short feedback loops, and space to express"
  }
};

function clampPotentialValue(value, fallback = 50) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function getMetricPreference(metrics = {}, letter) {
  const clean = {
    I: clampPotentialValue(metrics.I),
    N: clampPotentialValue(metrics.N),
    T: clampPotentialValue(metrics.T),
    J: clampPotentialValue(metrics.J)
  };
  const values = {
    I: clean.I,
    E: 100 - clean.I,
    N: clean.N,
    S: 100 - clean.N,
    T: clean.T,
    F: 100 - clean.T,
    J: clean.J,
    P: 100 - clean.J
  };
  return values[letter] ?? 50;
}

function getPotentialType(result = {}) {
  if (result.type && String(result.type).length === 4) return String(result.type).toUpperCase();
  if (typeof getPersonalityTypeFromMetrics === "function") return getPersonalityTypeFromMetrics(result.metrics || {});
  const metrics = result.metrics || {};
  return `${getMetricPreference(metrics, "I") >= 50 ? "I" : "E"}${getMetricPreference(metrics, "N") >= 50 ? "N" : "S"}${getMetricPreference(metrics, "T") >= 50 ? "T" : "F"}${getMetricPreference(metrics, "J") >= 50 ? "J" : "P"}`;
}

function scorePotentialField(field, type, metrics) {
  const profile = COGNILENS_TYPE_POTENTIAL[type] || {};
  const traitScore = field.traits.reduce((sum, letter) => sum + getMetricPreference(metrics, letter), 0) / field.traits.length;
  const typeBoost = profile.fields?.includes(field.id) ? 10 : 0;
  const firstChoiceBoost = profile.fields?.[0] === field.id ? 4 : 0;
  return clampPotentialValue(traitScore * 0.86 + typeBoost + firstChoiceBoost, 35);
}

function buildPotentialPlan(topField) {
  return [
    `Build one small proof project in ${topField.shortTitle.toLowerCase()} so your strength becomes visible.`,
    `Learn one core tool or framework connected to ${topField.skills[0]}.`,
    "Publish the result as a short case study: problem, process, result, and what you learned."
  ];
}

function getCogniLensPotential(result = {}) {
  const metrics = result.metrics || { I: 50, N: 50, T: 50, J: 50 };
  const type = getPotentialType(result);
  const profile = COGNILENS_TYPE_POTENTIAL[type] || COGNILENS_TYPE_POTENTIAL.INTJ;
  const fieldScores = COGNILENS_FIELD_RULES
    .map((field) => ({
      ...field,
      score: scorePotentialField(field, type, metrics)
    }))
    .sort((a, b) => b.score - a.score);
  const topField = fieldScores[0];
  const confidence = clampPotentialValue(result.confidence || fieldScores.slice(0, 3).reduce((sum, field) => sum + field.score, 0) / 3);

  return {
    type,
    confidence,
    headline: `${type} potential map`,
    userLine: profile.voice,
    focus: topField.title,
    focusScore: topField.score,
    environment: profile.environment,
    topFields: fieldScores,
    strengths: profile.strengths,
    risks: profile.risks,
    growthPlan: buildPotentialPlan(topField),
    connectiveCopy: `Your result does not decide your future. It shows where effort may compound faster: ${topField.title.toLowerCase()}, especially when the work gives you ${profile.environment}.`
  };
}

window.COGNILENS_FIELD_RULES = COGNILENS_FIELD_RULES;
window.COGNILENS_TYPE_POTENTIAL = COGNILENS_TYPE_POTENTIAL;
window.getCogniLensPotential = getCogniLensPotential;
