const phaseDefinitions = [
  {
    id: "P1",
    name: "Phase 1 - Core",
    displayCount: "6 Questions",
    data: [
      {
        type: "select",
        customInput: true,
        q: "When starting a task, you usually:",
        options: ["Make a clear plan first", "Start and adjust as you go"],
        traits: ["J", "P"],
        explain: "Simple meaning:\nThis checks whether you naturally prefer planning before action or learning while moving."
      },
      {
        type: "select",
        customInput: true,
        q: "When making decisions, you rely more on:",
        options: ["Logic and facts", "Feelings and situation"],
        traits: ["T", "F"],
        explain: "Simple meaning:\nThis checks whether your first decision filter is objective logic or personal/emotional context."
      },
      {
        type: "select",
        customInput: true,
        q: "You're more interested in:",
        options: ["Practical things that are directly useful", "Ideas and possibilities"],
        traits: ["S", "N"],
        explain: "Simple meaning:\nThis checks whether your attention goes first to real-world usefulness or future possibilities."
      },
      {
        type: "select",
        customInput: true,
        q: "In your free time, you naturally:",
        options: ["Stay engaged on your own", "Connect with others"],
        traits: ["I", "E"],
        explain: "Simple meaning:\nThis checks whether your energy usually refills through solo focus or social connection."
      },
      {
        type: "select",
        customInput: true,
        q: "When there's a deadline:",
        options: ["You finish early or on time", "You work best close to the deadline"],
        traits: ["J", "P"],
        explain: "Simple meaning:\nThis checks whether you naturally close tasks early or rely on last-minute pressure."
      },
      {
        type: "select",
        customInput: true,
        q: "When something is unclear:",
        options: ["You decide quickly and move on", "You explore more before deciding"],
        traits: ["J", "P"],
        explain: "Simple meaning:\nThis checks whether you prefer closure quickly or keeping options open until more is explored."
      }
    ]
  },
  {
    id: "P2",
    name: "Phase 2 - Preferences",
    displayCount: "5 Questions",
    data: [
      {
        type: "select",
        q: "Tum generally kya dekhna pasand karte ho?",
        options: ["Crime, strategy, mind games", "Love, emotions, relationships", "Real-life / realistic stories"],
        traits: ["T", "F", "S"]
      },
      {
        type: "select",
        q: "Free time milte hi tum kya karte ho?",
        options: ["Apne aap kuch karta hu (game, music, coding, etc.)", "Kisi se baat karta hu ya social hota hu"],
        traits: ["I", "E"]
      },
      {
        type: "select",
        q: "Tumhe zyada kis type ki baatein interesting lagti hain?",
        options: ["Future, ideas, possibilities", "Real life, practical cheezein"],
        traits: ["N", "S"]
      },
      {
        type: "select",
        q: "Tumhe kaunsa type ka content boring lagta hai?",
        options: ["Slow emotional stories", "Simple real-life / daily stuff"],
        traits: ["T", "N"]
      },
      {
        type: "select",
        q: "Tumhe zyada kya pasand hai?",
        options: ["Solo activities (gaming, editing, learning)", "Group activities (friends, chatting)"],
        traits: ["I", "E"]
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

function canRestoreAnswer(answer, question) {
  if (!answer || !question) return false;
  const savedOptions = answer.options || [];
  const baseOptionsMatch = JSON.stringify(savedOptions.slice(0, question.options?.length || 0)) === JSON.stringify(question.options || []);
  return answer.type === question.type
    && answer.question === question.q
    && baseOptionsMatch
    && JSON.stringify(answer.traits || []) === JSON.stringify(question.traits || []);
}

function restoreAssessmentProgress() {
  if (!isQuestionSettingEnabled("autosaveProgress", true)) return false;
  try {
    const saved = JSON.parse(window.localStorage?.getItem(COGNILENS_ASSESSMENT_PROGRESS_KEY)) || null;
    if (!saved || !Array.isArray(saved.answers)) return false;
    const restoredAnswers = [];
    for (let index = 0; index < Math.min(saved.answers.length, questions.length); index += 1) {
      if (!canRestoreAnswer(saved.answers[index], questions[index])) break;
      restoredAnswers.push(saved.answers[index]);
    }
    answers = restoredAnswers;
    current = Math.max(0, Math.min(Number(saved.current) || 0, answers.length, questions.length - 1));
    maxUnlockedPhaseIndex = Math.max(0, Math.min(Number(saved.maxUnlockedPhaseIndex) || 0, questions[current]?.phaseIndex || 0));
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

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function renderSelect(q) {
  const hasCustomInput = q.customInput !== false;
  const savedCustomTexts = answers[current]?.customTexts || [];
  const savedCustomText = answers[current]?.customAnswer || savedCustomTexts[q.options.length] || savedCustomTexts.find(Boolean) || "";
  const optionMarkup = q.options.map((option, index) => {
    const letter = String.fromCharCode(65 + index);
    if (!hasCustomInput) {
      return `<button class="option" data-option-index="${index}" type="button">${escapeHtml(option)}</button>`;
    }
    return `
      <div class="option-group" data-option-wrapper="${index}">
        <button class="option option-with-letter" data-option-index="${index}" type="button">
          <span class="option-letter">${letter}</span>
          <span>${escapeHtml(option)}</span>
        </button>
      </div>
    `;
  }).join("");

  const otherIndex = q.options.length;
  const otherMarkup = hasCustomInput ? `
    <div class="option-group other-option-group" data-option-wrapper="${otherIndex}">
      <button class="option option-with-letter" data-option-index="${otherIndex}" type="button">
        <span class="option-letter">${String.fromCharCode(65 + otherIndex)}</span>
        <span>Others</span>
      </button>
      <label class="other-box" for="custom-${current}-${otherIndex}">
        <span>Custom</span>
        <input id="custom-${current}-${otherIndex}" data-custom-option-index="${otherIndex}" type="text" value="${escapeHtml(savedCustomText)}" placeholder="Type your own answer...">
      </label>
    </div>
  ` : "";

  optionsEl.innerHTML = optionMarkup + otherMarkup;

  optionsEl.querySelectorAll("[data-option-index]").forEach((button) => {
    button.addEventListener("click", () => selectOption(Number(button.dataset.optionIndex)));
  });

  optionsEl.querySelectorAll("[data-custom-option-index]").forEach((input) => {
    const optionIndex = Number(input.dataset.customOptionIndex);
    input.addEventListener("focus", () => selectOption(optionIndex));
    input.addEventListener("input", () => selectOption(optionIndex));
    input.addEventListener("keydown", (event) => handleCustomInputKeys(event, optionIndex));
  });
}

function focusSelectControl(index, preferCustomInput = false) {
  const buttons = [...optionsEl.querySelectorAll("[data-option-index]")];
  if (!buttons.length) return;
  const safeIndex = (index + buttons.length) % buttons.length;
  updateFocusedOption(safeIndex);

  const customInput = optionsEl.querySelector(`[data-custom-option-index="${safeIndex}"]`);
  if (preferCustomInput && customInput) {
    customInput.focus();
    return;
  }

  buttons[safeIndex]?.focus();
}

function handleCustomInputKeys(event, optionIndex) {
  if (!isQuestionSettingEnabled("keyboardControls", true)) return;
  const buttons = [...optionsEl.querySelectorAll("[data-option-index]")];
  if (!buttons.length) return;

  if (event.key === "ArrowUp") {
    event.preventDefault();
    focusSelectControl(optionIndex - 1);
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    focusSelectControl(optionIndex + 1);
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    selectOption(optionIndex);
    nextQuestion();
  }
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
    && JSON.stringify(previous.values || []) === JSON.stringify(next.values || [])
    && JSON.stringify(previous.customTexts || []) === JSON.stringify(next.customTexts || []);
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
  optionsEl.querySelectorAll("[data-option-wrapper]").forEach((wrapper) => {
    wrapper.classList.toggle("selected", Number(wrapper.dataset.optionWrapper) === focusedOption);
  });
}

function updateFocusedOption(index) {
  const buttons = [...optionsEl.querySelectorAll("[data-option-index]")];
  if (!buttons.length) return;
  focusedOption = (index + buttons.length) % buttons.length;
  buttons.forEach((button, buttonIndex) => {
    button.classList.toggle("focused", buttonIndex === focusedOption);
  });
  optionsEl.querySelectorAll("[data-option-wrapper]").forEach((wrapper) => {
    wrapper.classList.toggle("focused", Number(wrapper.dataset.optionWrapper) === focusedOption);
  });
}

function getCustomTextsForCurrentQuestion() {
  return [...optionsEl.querySelectorAll("[data-custom-option-index]")]
    .sort((a, b) => Number(a.dataset.customOptionIndex) - Number(b.dataset.customOptionIndex))
    .map((input) => input.value.trim());
}

function getCustomTextForCurrentQuestion() {
  return optionsEl.querySelector("[data-custom-option-index]")?.value.trim() || "";
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
    const hasCustomInput = q.customInput !== false;
    const customAnswer = hasCustomInput ? getCustomTextForCurrentQuestion() : "";
    const savedOptions = hasCustomInput ? [...q.options, customAnswer || "Others"] : q.options;
    saveAnswerAtCurrent({
      phase: q.phaseId,
      type: q.type,
      question: q.q,
      options: savedOptions,
      traits: q.traits,
      selected,
      values: savedOptions.map((_, index) => index === selected ? 10 : 0),
      customAnswer,
      customTexts: hasCustomInput ? getCustomTextsForCurrentQuestion() : []
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
  const target = event.target;
  if (target?.matches?.("input, textarea, [contenteditable='true']")) return;

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
    focusSelectControl(focusedOption + 1);
  }
  if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    event.preventDefault();
    focusSelectControl(focusedOption - 1);
  }
  if (event.key === " ") {
    event.preventDefault();
    selectOption(focusedOption);
  }
  if (event.key === "Enter") {
    event.preventDefault();
    const customInput = optionsEl.querySelector(`[data-custom-option-index="${focusedOption}"]`);
    if (customInput && document.activeElement !== customInput) {
      selectOption(focusedOption);
      customInput.focus();
      return;
    }
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
