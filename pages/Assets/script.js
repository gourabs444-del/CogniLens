const phaseDefinitions = [
  {
    id: "P1",
    name: "Phase 1 - Core",
    displayCount: "6 Questions",
    data: [
      {
        type: "select",
        q: "When you are faced with an important decision in life, what do you naturally do first before taking action?",
        options: ["Analyze logically", "Consider people", "Go with instinct"],
        traits: ["T", "F", "N"],
        explain: "Simple meaning:\nWhen you need to choose, what comes first in your head?\nLogic = you think like a puzzle.\nPeople = you think about feelings.\nInstinct = your heart says something quickly."
      },
      {
        type: "select",
        q: "After a long and mentally tiring day, what actually helps you feel relaxed and recharged?",
        options: ["Being alone", "Talking to someone", "Doing something active"],
        traits: ["I", "E", "P"],
        explain: "Simple meaning:\nAfter a tiring day, what gives your energy back?\nAlone = quiet time helps.\nTalking = people help.\nActive = moving or doing something helps."
      },
      {
        type: "select",
        q: "When you start something important or new, how do you usually approach it?",
        options: ["Plan it out", "Understand first", "Start immediately"],
        traits: ["J", "N", "P"],
        explain: "Simple meaning:\nWhen something new starts, what do you do first?\nPlan = make a small map.\nUnderstand = look at the idea first.\nStart = try it and learn."
      },
      {
        type: "select",
        q: "When you receive new information, how does your brain usually process it?",
        options: ["Break into steps", "Find patterns", "Use immediately"],
        traits: ["S", "N", "T"],
        explain: "Simple meaning:\nWhen new information comes, how do you use it?\nSteps = one by one.\nPatterns = connect the dots.\nUse now = try it quickly."
      },
      {
        type: "select",
        q: "When you enter a new group or environment, what do you naturally do?",
        options: ["Observe quietly", "Connect with a few", "Engage actively"],
        traits: ["I", "I", "E"],
        explain: "Simple meaning:\nIn a new group, what feels easiest?\nWatch quietly = you wait first.\nTalk to a few = you choose safe people.\nJoin actively = you jump in."
      },
      {
        type: "select",
        q: "Which way of living feels more natural to you in daily life?",
        options: ["Clear plan", "Flexible options", "Instant decisions"],
        traits: ["J", "P", "P"],
        explain: "Simple meaning:\nHow do you like your day to feel?\nClear plan = you like knowing the path.\nFlexible = you like choices.\nInstant = you decide fast."
      }
    ]
  },
  {
    id: "P2",
    name: "Phase 2 - Allocation",
    displayCount: "3 Allocation Questions",
    data: [
      {
        type: "allocation",
        q: "You have 10 points. Divide them based on what matters most during decisions.",
        options: ["Logic", "People", "Speed"],
        traits: ["T", "F", "P"],
        explain: "Simple meaning:\nYou have 10 coins.\nPut more coins on what matters most to you.\nExample: Logic 6, People 3, Speed 1. All coins together must be 10."
      },
      {
        type: "allocation",
        q: "You have 10 points. Divide them across your problem-solving style.",
        options: ["Steps", "Big picture", "Try and test"],
        traits: ["S", "N", "P"],
        explain: "Simple meaning:\nYou have 10 coins for solving problems.\nSteps = do it one by one.\nBig picture = see the whole story.\nTry and test = learn by doing."
      },
      {
        type: "allocation",
        q: "You have 10 points. Divide them across your life priority.",
        options: ["Stability", "Freedom", "Risk"],
        traits: ["J", "P", "E"],
        explain: "Simple meaning:\nYou have 10 coins for what you like in life.\nStability = safe and steady.\nFreedom = open choices.\nRisk = big challenge or adventure."
      }
    ]
  },
  {
    id: "P3",
    name: "Phase 3 - Moral",
    displayCount: "3 Questions",
    data: [
      {
        type: "select",
        q: "If you had to choose between saving one close person or five strangers, what would you do?",
        options: ["Save five strangers", "Save the close person", "It depends on the situation"],
        traits: ["F", "I", "N"],
        explain: "Simple meaning:\nImagine you can help only one side.\nOne choice helps more people.\nOne choice helps someone close.\nThe third means you need more details first."
      },
      {
        type: "select",
        q: "If telling the truth could hurt someone badly, what would you do?",
        options: ["Tell the truth anyway", "Hide or soften the truth", "Choose based on situation"],
        traits: ["T", "F", "N"],
        explain: "Simple meaning:\nSometimes truth can hurt feelings.\nOne answer says truth first.\nOne answer says protect feelings.\nOne answer says decide after seeing the situation."
      },
      {
        type: "select",
        q: "If breaking a rule could help many people, what would you do?",
        options: ["Follow the rule no matter what", "Break the rule to help others", "Decide based on the situation"],
        traits: ["J", "F", "N"],
        explain: "Simple meaning:\nA rule says no, but people need help.\nOne answer follows the rule.\nOne answer helps people.\nOne answer checks the full situation first."
      }
    ]
  },
  {
    id: "P4",
    name: "Phase 4 - Pressure",
    displayCount: "2 Timed Questions",
    data: [
      {
        type: "select",
        timeLimit: 10,
        q: "Quick! Someone insults you publicly. What do you do first?",
        options: ["Ignore and stay calm", "Respond immediately", "Think before reacting"],
        traits: ["I", "E", "T"],
        explain: "Simple meaning:\nSomeone says something bad in front of people.\nWhat is your first quick reaction?\nChoose the answer that feels most natural."
      },
      {
        type: "select",
        timeLimit: 10,
        q: "You must decide quickly. Trust what?",
        options: ["Logic", "Gut feeling", "People around you"],
        traits: ["T", "N", "F"],
        explain: "Simple meaning:\nYou must choose fast.\nWhat do you trust first?\nLogic = facts. Gut = inner feeling. People = what others say."
      }
    ]
  },
  {
    id: "P5",
    name: "Phase 5 - Hidden",
    displayCount: "2 Questions",
    data: [
      {
        type: "select",
        q: "In a stressful situation, what do you actually end up doing most of the time?",
        options: ["Slow down and think carefully", "React quickly without overthinking", "Look at what others are doing first"],
        traits: ["T", "P", "E"],
        explain: "Simple meaning:\nWhen pressure comes, what do you really do?\nNot the perfect answer. Pick the honest answer."
      },
      {
        type: "select",
        q: "When things don't go as planned, what is your natural reaction?",
        options: ["Try to fix it logically step by step", "Adapt quickly and try something else", "Wait and observe before acting"],
        traits: ["T", "P", "I"],
        explain: "Simple meaning:\nYour plan breaks.\nDo you fix step by step, try a new way, or wait and watch first?"
      }
    ]
  },
  {
    id: "P6",
    name: "Phase 6 - Final",
    displayCount: "2 Questions",
    data: [
      {
        type: "select",
        q: "You made a decision that logically made sense, but people reacted negatively. What do you do next?",
        options: ["Stick with the decision because it was logically correct", "Adjust the decision to improve people's reaction", "Pause and rethink everything again"],
        traits: ["T", "F", "N"],
        explain: "Simple meaning:\nYour choice made sense, but people got upset.\nDo you keep it, change it, or stop and think again?"
      },
      {
        type: "select",
        q: "You followed your instinct, but it turned out wrong. What is your natural response?",
        options: ["Trust logic more next time", "Still trust your instinct", "Balance both depending on situation"],
        traits: ["T", "N", "J"],
        explain: "Simple meaning:\nYour feeling told you to do something, but it went wrong.\nNext time, do you trust logic, trust feeling again, or use both?"
      }
    ]
  }
];

const typeTitles = {
  ISTJ: "Practical Systems Guardian",
  ISFJ: "Supportive Detail Keeper",
  INFJ: "Insightful Purpose Builder",
  INTJ: "Strategic Systems Thinker",
  ISTP: "Precise Tactical Solver",
  ISFP: "Grounded Creative Observer",
  INFP: "Reflective Values Explorer",
  INTP: "Analytical Pattern Architect",
  ESTP: "Action-Oriented Problem Mover",
  ESFP: "Expressive Experience Driver",
  ENFP: "Possibility-Focused Connector",
  ENTP: "Inventive Challenge Solver",
  ESTJ: "Structured Execution Leader",
  ESFJ: "Collaborative Support Organizer",
  ENFJ: "People-Centered Vision Guide",
  ENTJ: "Decisive Strategy Builder"
};

const phaseStarts = [];
const questions = [];
phaseDefinitions.forEach((phase, phaseIndex) => {
  phaseStarts[phaseIndex] = questions.length;
  phase.data.forEach((question, indexInPhase) => {
    questions.push({ ...question, phaseIndex, phaseId: phase.id, indexInPhase });
  });
});

let current = 0;
let selected = null;
let focusedOption = 0;
let answers = [];
let timerId = null;
let timerRemaining = 0;
let isRestoringHistory = false;
let maxUnlockedPhaseIndex = 0;
const COGNILENS_ASSESSMENT_PROGRESS_KEY = "cognilensAssessmentProgress";

const app = document.getElementById("app");
const pipeline = document.getElementById("pipeline");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const phaseProgressText = document.getElementById("phaseProgressText");
const phaseName = document.getElementById("phase-name");
const questionTitle = document.getElementById("question-title");
const questionText = document.getElementById("question-text");
const optionsEl = document.getElementById("options");
const totalPanel = document.getElementById("totalPanel");
const totalEl = document.getElementById("total");
const errorEl = document.getElementById("error");
const explainBox = document.getElementById("explainBox");
const helpButton = document.getElementById("helpButton");
const nextButton = document.getElementById("nextButton");
const phaseScreen = document.getElementById("phase-screen");
const phaseBigTitle = document.getElementById("phase-big-title");
const phaseSubtitle = document.getElementById("phase-subtitle");
const phaseOverview = document.getElementById("phaseOverview");
const phaseStartButton = document.getElementById("phaseStartButton");
const timerPanel = document.getElementById("timerPanel");
const timerValue = document.getElementById("timerValue");
const timerFill = document.getElementById("timerFill");

function isQuestionSettingEnabled(key, fallback = true) {
  if (typeof getCogniLensSetting === "function") return getCogniLensSetting(key, fallback);
  try {
    const value = window.localStorage?.getItem(`cognilensSetting:${key}`);
    if (value === null || value === undefined) return fallback;
    return value === "true";
  } catch (error) {
    return fallback;
  }
}

function persistAssessmentProgress() {
  if (!isQuestionSettingEnabled("autosaveProgress", true)) {
    try {
      window.localStorage?.removeItem(COGNILENS_ASSESSMENT_PROGRESS_KEY);
    } catch (error) {}
    return;
  }
  try {
    window.localStorage?.setItem(COGNILENS_ASSESSMENT_PROGRESS_KEY, JSON.stringify({
      current,
      answers,
      maxUnlockedPhaseIndex,
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {}
}

function restoreAssessmentProgress() {
  if (!isQuestionSettingEnabled("autosaveProgress", true)) return false;
  try {
    const saved = JSON.parse(window.localStorage?.getItem(COGNILENS_ASSESSMENT_PROGRESS_KEY)) || null;
    if (!saved || !Array.isArray(saved.answers)) return false;
    current = Math.max(0, Math.min(Number(saved.current) || 0, questions.length - 1));
    answers = saved.answers.slice(0, questions.length);
    maxUnlockedPhaseIndex = Math.max(0, Math.min(Number(saved.maxUnlockedPhaseIndex) || 0, phaseDefinitions.length - 1));
    selected = null;
    return answers.length > 0 || current > 0;
  } catch (error) {
    return false;
  }
}

function renderOverview() {
  phaseOverview.innerHTML = phaseDefinitions.map((phase) => `
    <div class="phase-overview-card">
      <strong>${phase.id}</strong>
      <span>${phase.displayCount}</span>
    </div>
  `).join("");
}

function currentPhase() {
  return phaseDefinitions[questions[current]?.phaseIndex || 0];
}

function getMaxUnlockedPhaseIndex() {
  return maxUnlockedPhaseIndex;
}

function renderPipeline() {
  pipeline.innerHTML = phaseDefinitions.map((phase, index) => {
    const start = phaseStarts[index];
    const end = start + phase.data.length;
    const isUnlocked = index <= getMaxUnlockedPhaseIndex();
    let cls = "";
    if (current >= end) cls = "done";
    else if (current >= start) cls = "active";
    if (!isUnlocked) cls += " locked";
    return `<button class="phase ${cls.trim()}" data-phase-index="${index}" type="button" ${isUnlocked ? "" : "disabled aria-disabled=\"true\""}>${phase.id}</button>`;
  }).join("");

  pipeline.querySelectorAll("[data-phase-index]").forEach((button) => {
    button.addEventListener("click", () => goToPhase(Number(button.dataset.phaseIndex)));
  });
}

function updateProgress() {
  const phase = currentPhase();
  const percent = current >= questions.length ? 100 : (current / questions.length) * 100;
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `Question ${Math.min(current + 1, questions.length)} / ${questions.length}`;
  phaseProgressText.textContent = `${phase.id} (${questions[current].indexInPhase + 1}/${phase.data.length})`;
  phaseName.textContent = phase.name;
}

function writeQuestionHistory(replace = false) {
  if (!window.history?.pushState) return;
  const state = { cogniLensQuestion: true, current };
  if (replace) history.replaceState(state, "", window.location.href);
  else history.pushState(state, "", window.location.href);
}

function stopTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
  timerPanel.hidden = true;
}

function startTimer(seconds) {
  stopTimer();
  timerRemaining = seconds;
  timerPanel.hidden = false;
  timerValue.textContent = timerRemaining;
  timerFill.style.width = "100%";

  timerId = setInterval(() => {
    timerRemaining -= 1;
    timerValue.textContent = Math.max(timerRemaining, 0);
    timerFill.style.width = `${Math.max(timerRemaining, 0) / seconds * 100}%`;

    if (timerRemaining <= 0) {
      stopTimer();
      if (selected === null) selectOption(2);
      nextQuestion(true);
    }
  }, 1000);
}

function getPhaseIntroText(phase, isInitial) {
  if (isInitial) {
    return "You will move through 6 short phases. Each phase unlocks after you complete the previous one, and you can come back to completed phases from the phase buttons.";
  }

  const timedQuestions = phase.data.filter((item) => item.timeLimit);
  if (timedQuestions.length) {
    const seconds = timedQuestions[0].timeLimit;
    return `${phase.name}. This phase has ${phase.data.length} questions. ${timedQuestions.length} questions are timed, and each timed question gives you ${seconds} seconds. Get ready, choose naturally, and do not overthink.`;
  }

  if (phase.data.some((item) => item.type === "allocation")) {
    return `${phase.name}. This phase has ${phase.data.length} allocation questions. Put numbers into the boxes so each question totals exactly 10 points.`;
  }

  return `${phase.name}. This phase has ${phase.data.length} questions. Read the short situation, choose the answer that feels most natural, and continue.`;
}

function showPhaseOverlay(phase, isInitial = false) {
  app.classList.add("blur");
  phaseScreen.classList.add("active");
  phaseBigTitle.textContent = isInitial ? "6 smooth phases" : `${phase.id} starting`;
  phaseSubtitle.textContent = getPhaseIntroText(phase, isInitial);
  phaseStartButton.textContent = isInitial ? "Start Phase 1" : `Continue to ${phase.id}`;
  phaseStartButton.hidden = false;
}

function hidePhaseOverlay() {
  phaseScreen.classList.remove("active");
  app.classList.remove("blur");
}

function loadQuestion(showTransition = false) {
  if (current >= questions.length) {
    finishTest();
    return;
  }

  const q = questions[current];
  const phase = currentPhase();
  maxUnlockedPhaseIndex = Math.max(maxUnlockedPhaseIndex, q.phaseIndex);

  if (showTransition) {
    showPhaseOverlay(phase);
    return;
  }

  stopTimer();
  selected = null;
  focusedOption = 0;
  errorEl.textContent = "";
  explainBox.textContent = q.explain || "";
  explainBox.style.display = "none";
  totalPanel.hidden = q.type !== "allocation";

  renderPipeline();
  updateProgress();

  questionTitle.textContent = `Q${current + 1}`;
  questionText.textContent = q.q;

  if (q.type === "allocation") renderAllocation(q);
  else renderSelect(q);

  restoreAnswerForCurrentQuestion();

  if (q.timeLimit) startTimer(10);
}

function goToPhase(phaseIndex) {
  if (!Number.isFinite(phaseIndex) || phaseIndex > getMaxUnlockedPhaseIndex()) return;
  const targetIndex = phaseStarts[phaseIndex];
  if (targetIndex === undefined) return;
  stopTimer();
  hidePhaseOverlay();
  current = targetIndex;
  selected = null;
  writeQuestionHistory(false);
  loadQuestion(false);
}

function renderSelect(q) {
  optionsEl.innerHTML = q.options.map((option, index) =>
    `<button class="option" data-option-index="${index}" type="button">${option}</button>`
  ).join("");

  optionsEl.querySelectorAll("[data-option-index]").forEach((button) => {
    button.addEventListener("click", () => selectOption(Number(button.dataset.optionIndex)));
  });
}

function renderAllocation(q) {
  optionsEl.innerHTML = q.options.map((option, index) => `
    <label class="option allocation-row">
      <span>${option}</span>
      <input id="a${index}" data-allocation-index="${index}" type="number" inputmode="numeric" min="0" max="10" step="1" value="0">
    </label>
  `).join("");
  updateAllocationTotalState(0);

  const inputs = [...document.querySelectorAll("[data-allocation-index]")];
  inputs.forEach((input, index) => {
    input.addEventListener("input", () => updateAllocation(input));
    input.addEventListener("focus", () => input.select());
    input.addEventListener("click", () => input.select());
    input.addEventListener("keydown", (event) => handleAllocationKeys(event, index, inputs));
  });

  setTimeout(() => inputs[0]?.focus(), 0);
}

function restoreAnswerForCurrentQuestion() {
  const answer = answers[current];
  if (!answer) {
    if (questions[current]?.type === "select") updateFocusedOption(0);
    return;
  }

  if (answer.type === "select") {
    selectOption(answer.selected);
    return;
  }

  const inputs = [...document.querySelectorAll("[data-allocation-index]")];
  inputs.forEach((input, index) => {
    input.value = answer.values?.[index] ?? 0;
  });
  updateAllocationTotalState(inputs.map(numberValue).reduce((sum, value) => sum + value, 0));
}

function isSameAnswer(previous, next) {
  if (!previous || !next) return false;
  return previous.type === next.type
    && previous.selected === next.selected
    && JSON.stringify(previous.values || []) === JSON.stringify(next.values || []);
}

function saveAnswerAtCurrent(answer) {
  const unchanged = isSameAnswer(answers[current], answer);
  answers[current] = answer;
  if (!unchanged) {
    answers = answers.slice(0, current + 1);
    maxUnlockedPhaseIndex = questions[current]?.phaseIndex || 0;
  }
  persistAssessmentProgress();
}

function selectOption(index) {
  const buttons = [...optionsEl.querySelectorAll("[data-option-index]")];
  if (!buttons.length) return;
  focusedOption = Math.max(0, Math.min(index, buttons.length - 1));
  selected = focusedOption;
  buttons.forEach((button, buttonIndex) => {
    button.classList.toggle("selected", buttonIndex === focusedOption);
    button.classList.toggle("focused", buttonIndex === focusedOption);
  });
}

function updateFocusedOption(index) {
  const buttons = [...optionsEl.querySelectorAll("[data-option-index]")];
  if (!buttons.length) return;
  focusedOption = (index + buttons.length) % buttons.length;
  buttons.forEach((button, buttonIndex) => {
    button.classList.toggle("focused", buttonIndex === focusedOption);
  });
}

function numberValue(input) {
  const value = Math.round(Number(input.value) || 0);
  return Math.max(0, Math.min(10, value));
}

function updateAllocationTotalState(total) {
  totalEl.textContent = total;
  totalPanel.classList.toggle("is-over-limit", total > 10);
  totalPanel.classList.toggle("is-complete", total === 10);
}

function updateAllocation(changedInput) {
  const inputs = [...document.querySelectorAll("[data-allocation-index]")];
  const changedIndex = inputs.indexOf(changedInput);
  const values = inputs.map((input, index) => {
    const value = numberValue(input);
    if (index === changedIndex) input.value = value;
    return value;
  });
  updateAllocationTotalState(values.reduce((sum, value) => sum + value, 0));
}

function handleAllocationKeys(event, index, inputs) {
  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    event.preventDefault();
    inputs[Math.min(index + 1, inputs.length - 1)]?.focus();
  }
  if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    event.preventDefault();
    inputs[Math.max(index - 1, 0)]?.focus();
  }
  if (event.key === "Enter") {
    event.preventDefault();
    if (index < inputs.length - 1) inputs[index + 1].focus();
    else nextQuestion();
  }
}

function nextQuestion(fromTimer = false) {
  const q = questions[current];
  errorEl.textContent = "";

  if (q.type === "select") {
    if (selected === null) {
      if (fromTimer) selectOption(2);
      else {
        errorEl.textContent = "Select one option to continue.";
        return;
      }
    }
    saveAnswerAtCurrent({
      phase: q.phaseId,
      type: q.type,
      question: q.q,
      options: q.options,
      traits: q.traits,
      selected,
      values: q.options.map((_, index) => index === selected ? 10 : 0)
    });
  } else {
    const inputs = [...document.querySelectorAll("[data-allocation-index]")];
    const values = inputs.map(numberValue);
    const total = values.reduce((sum, value) => sum + value, 0);

    if (total !== 10) {
      errorEl.textContent = total > 10
        ? "You used more than 10 points. Reduce any box until the total is exactly 10."
        : "Use all 10 points before continuing.";
      return;
    }

    saveAnswerAtCurrent({
      phase: q.phaseId,
      type: q.type,
      question: q.q,
      options: q.options,
      traits: q.traits,
      values
    });
  }

  stopTimer();
  const oldPhaseIndex = q.phaseIndex;
  current += 1;
  persistAssessmentProgress();
  if (!isRestoringHistory) writeQuestionHistory(false);

  if (current >= questions.length) {
    finishTest();
    return;
  }

  const phaseChanged = questions[current].phaseIndex !== oldPhaseIndex;
  loadQuestion(phaseChanged);
}

function goToQuestionFromHistory(index) {
  const safeIndex = Math.max(0, Math.min(Number(index) || 0, questions.length - 1));
  isRestoringHistory = true;
  stopTimer();
  hidePhaseOverlay();
  current = safeIndex;
  loadQuestion(false);
  isRestoringHistory = false;
}

function buildResult() {
  const totals = { I: 0, E: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };

  answers.forEach((answer) => {
    answer.values.forEach((value, index) => {
      const trait = answer.traits[index];
      if (trait && totals[trait] !== undefined) totals[trait] += value;
    });
  });

  const score = typeof getPersonalityResult === "function"
    ? getPersonalityResult(totals)
    : { type: "INTJ", confidence: 0, breakdown: {}, warning: null };
  const metrics = typeof getPersonalityMetrics === "function"
    ? getPersonalityMetrics(totals)
    : { I: 50, N: 50, T: 50, J: 50 };
  const type = score.type;
  const strongest = Object.entries(metrics).sort((a, b) => Math.abs(b[1] - 50) - Math.abs(a[1] - 50))[0];

  return {
    type,
    confidence: score.confidence,
    breakdown: score.breakdown,
    warning: score.warning,
    metrics,
    totals,
    answers,
    title: typeof getPersonalityTitle === "function" ? getPersonalityTitle(type) : (typeTitles[type] || `${type} Personality Profile`),
    summary: `Your result is generated from six assessment phases with ${score.confidence}% confidence. The strongest current signal is ${strongest[0]} at ${strongest[1]}%.`,
    tags: ["Six-phase", "Self-aware", "Story-ready"]
  };
}

function finishTest() {
  stopTimer();
  saveCogniLensResult(buildResult());
  try {
    window.localStorage?.removeItem(COGNILENS_ASSESSMENT_PROGRESS_KEY);
  } catch (error) {}
  app.innerHTML = `
    <section class="question-card" style="text-align:center">
      <div class="question-kicker">Completed</div>
      <h1 id="question-text">Your result is ready.</h1>
      <p style="color:#64748b;line-height:1.6">Opening your CogniLens result dashboard...</p>
    </section>
  `;
  setTimeout(() => {
    window.location.href = "../dashboard/result.html";
  }, 650);
}

function toggleExplain() {
  explainBox.style.display = explainBox.style.display === "block" ? "none" : "block";
}

document.addEventListener("keydown", (event) => {
  if (!isQuestionSettingEnabled("keyboardControls", true)) return;

  if (phaseScreen.classList.contains("active")) {
    if (event.key === "Enter") {
      event.preventDefault();
      phaseStartButton.click();
    }
    return;
  }

  const q = questions[current];
  if (!q || q.type !== "select") return;

  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    event.preventDefault();
    updateFocusedOption(focusedOption + 1);
  }
  if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    event.preventDefault();
    updateFocusedOption(focusedOption - 1);
  }
  if (event.key === " ") {
    event.preventDefault();
    selectOption(focusedOption);
  }
  if (event.key === "Enter") {
    event.preventDefault();
    if (selected === null) selectOption(focusedOption);
    else nextQuestion();
  }
});

helpButton.addEventListener("click", toggleExplain);
nextButton.addEventListener("click", () => nextQuestion());
phaseStartButton.addEventListener("click", () => {
  hidePhaseOverlay();
  loadQuestion(false);
});

window.addEventListener("popstate", (event) => {
  if (event.state?.cogniLensQuestion) {
    goToQuestionFromHistory(event.state.current);
  }
});

const restoredAssessmentProgress = restoreAssessmentProgress();
renderOverview();
writeQuestionHistory(true);
showPhaseOverlay(phaseDefinitions[questions[current]?.phaseIndex || 0], current === 0 && !restoredAssessmentProgress);
