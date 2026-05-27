const ACTIVE_PHASE_IDS = new Set(["P1", "P2", "P3", "P4"]);
const loadedPhaseDefinitions = window.COGNILENS_PHASES || window.COGNILENS_PHASE_DEFINITIONS || [];
const phaseDefinitions = loadedPhaseDefinitions.filter((phase) => ACTIVE_PHASE_IDS.has(phase.id));
if (!phaseDefinitions.length) { throw new Error('CogniLens phase files were not loaded.'); }
const RESULT_PAGE_PATH = window.COGNILENS_RESULT_PATH
  || (window.location.pathname.includes("/mbti-system/")
    ? "../../../pages/dashboard/result.html"
    : "../dashboard/result.html");

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
let questionStartedAt = 0;
let isRestoringHistory = false;
let isFinishing = false;
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

function isRapidFirePhase(phase = currentPhase()) {
  return phase?.id === "P4";
}

function getMaxUnlockedPhaseIndex() {
  return maxUnlockedPhaseIndex;
}

function renderPipeline() {
  pipeline.innerHTML = phaseDefinitions.map((phase, index) => {
    const start = phaseStarts[index];
    const end = start + phase.data.length;
    const lockedByRapidFire = isRapidFirePhase() && index !== (questions[current]?.phaseIndex || 0);
    const isUnlocked = index <= getMaxUnlockedPhaseIndex() && !lockedByRapidFire;
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
      if (selected === null) {
        const optionCount = questions[current]?.options?.length || 1;
        selectOption(Math.min(focusedOption, optionCount - 1));
      }
      nextQuestion(true);
    }
  }, 1000);
}

function getPhaseIntroText(phase, isInitial) {
  if (isInitial) {
    return "You will move through 4 phases: self-image, hidden preferences, contradiction checks, and rapid instinct choices. Phase 4 locks navigation so answers stay instinctive.";
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
  phaseBigTitle.textContent = isInitial ? "4 analysis phases" : `${phase.id} starting`;
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
  questionStartedAt = performance.now();

  questionTitle.textContent = `Q${current + 1}`;
  questionText.textContent = q.q;

  if (q.type === "allocation") renderAllocation(q);
  else renderSelect(q);

  restoreAnswerForCurrentQuestion();

  if (q.timeLimit) startTimer(q.timeLimit);
}

function goToPhase(phaseIndex) {
  if (!Number.isFinite(phaseIndex) || phaseIndex > getMaxUnlockedPhaseIndex()) return;
  if (isRapidFirePhase() && phaseIndex !== (questions[current]?.phaseIndex || 0)) return;
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
  const reactionTimeMs = questionStartedAt ? Math.max(0, Math.round(performance.now() - questionStartedAt)) : null;

  if (q.type === "select") {
    if (selected === null) {
      if (fromTimer) {
        const optionCount = q.options?.length || 1;
        selectOption(Math.min(focusedOption, optionCount - 1));
      }
      else {
        errorEl.textContent = "Select one option to continue.";
        return;
      }
    }
    const hasCustomInput = q.customInput !== false;
    const customOptionIndex = q.options.length;
    const selectedCustomAnswer = hasCustomInput && selected === customOptionIndex;
    const customAnswer = selectedCustomAnswer ? getCustomTextForCurrentQuestion() : "";
    if (selectedCustomAnswer && !customAnswer) {
      errorEl.textContent = "Type your custom answer before continuing.";
      return;
    }
    const savedOptions = hasCustomInput ? [...q.options, customAnswer || "Others"] : q.options;
    saveAnswerAtCurrent({
      id: q.id,
      phase: q.phaseId,
      type: q.type,
      question: q.q,
      options: savedOptions,
      traits: q.traits,
      selected,
      selectedLabel: savedOptions[selected] || "",
      values: savedOptions.map((_, index) => index === selected ? 10 : 0),
      customAnswer,
      customTexts: hasCustomInput ? getCustomTextsForCurrentQuestion() : [],
      reactionTimeMs,
      timeLimitMs: q.timeLimit ? q.timeLimit * 1000 : null,
      timedOut: Boolean(fromTimer && q.timeLimit),
      questionIndex: current,
      phaseIndex: q.phaseIndex
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
      id: q.id,
      phase: q.phaseId,
      type: q.type,
      question: q.q,
      options: q.options,
      traits: q.traits,
      values,
      reactionTimeMs,
      timeLimitMs: q.timeLimit ? q.timeLimit * 1000 : null,
      timedOut: Boolean(fromTimer && q.timeLimit),
      questionIndex: current,
      phaseIndex: q.phaseIndex
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
  if (isRapidFirePhase() && safeIndex < current) {
    writeQuestionHistory(true);
    return;
  }
  isRestoringHistory = true;
  stopTimer();
  hidePhaseOverlay();
  current = safeIndex;
  loadQuestion(false);
  isRestoringHistory = false;
}

function buildResult() {
  if (!window.CogniLensCollector?.buildResult) {
    throw new Error('CogniLens collector was not loaded.');
  }
  return window.CogniLensCollector.buildResult(answers);
}

async function analyzeResult() {
  const localResult = buildResult();
  if (!window.CogniLensCollector?.analyzeWithBackend) return localResult;

  try {
    return await window.CogniLensCollector.analyzeWithBackend(answers, localResult);
  } catch (error) {
    return {
      ...localResult,
      source: "local-fallback",
      apiWarning: error?.message || "Backend analysis unavailable.",
      tags: [...(localResult.tags || []), "Local fallback"]
    };
  }
}

async function finishTest() {
  if (isFinishing) return;
  isFinishing = true;
  stopTimer();
  app.innerHTML = `
    <section class="question-card" style="text-align:center">
      <div class="question-kicker">Analyzing</div>
      <h1 id="question-text">Building your MBTI signal.</h1>
      <p style="color:#64748b;line-height:1.6">Combining MCQ scores, reaction time, contradiction checks, and custom answer analysis...</p>
    </section>
  `;
  const result = await analyzeResult();
  saveCogniLensResult(result);
  try {
    window.localStorage?.removeItem(COGNILENS_ASSESSMENT_PROGRESS_KEY);
  } catch (error) {}
  setTimeout(() => {
    window.location.href = RESULT_PAGE_PATH;
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

