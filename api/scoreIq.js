const IQ_GRADING_INSTRUCTION = [
  "Grade the user's IQ puzzle answers after the full test, never during the question flow.",
  "Multiple-choice answers are exact-match by option key.",
  "Text answers are judged from the expected answer context, normalized wording, numeric equivalence, and close synonyms.",
  "Return correct, close, or wrong with a short review explanation. This is a puzzle reasoning score, not a clinical IQ diagnosis."
].join(" ");

export const iqQuestions = Object.freeze([
  {
    id: "iq_q_1",
    number: 1,
    title: "Handshake Problem",
    prompt: "A room contains 100 people. Each person shook hands with exactly 3 other people in the room. How many handshakes took place?",
    inputType: "text",
    answerKind: "number",
    expected: 150,
    correctAnswer: "150 handshakes",
    explanation: "Each handshake is counted twice if you multiply 100 people by 3 handshakes, so 100 x 3 / 2 = 150."
  },
  {
    id: "iq_q_2",
    number: 2,
    title: "Number Transformation",
    prompt: "I thought of a number. Multiplied it by 2, added 5, divided by 2, then subtracted the original number. What is the result?",
    inputType: "choice",
    options: {
      A: "Depends on the number",
      B: "2",
      C: "2.5",
      D: "5"
    },
    correctOption: "C",
    correctAnswer: "2.5",
    explanation: "For any number x: ((2x + 5) / 2) - x = 2.5."
  },
  {
    id: "iq_q_3",
    number: 3,
    title: "Tea & Coffee",
    prompt: "In a village, 60% of people drink tea and 70% drink coffee. What is the minimum percentage of people who drink both tea and coffee?",
    inputType: "text",
    answerKind: "percent",
    expected: 30,
    correctAnswer: "30%",
    explanation: "The minimum overlap is 60 + 70 - 100 = 30%."
  },
  {
    id: "iq_q_4",
    number: 4,
    title: "Bat and Ball",
    prompt: "A bat and a ball cost Rs. 110 in total. The bat costs Rs. 100 more than the ball. How much does the ball cost?",
    inputType: "text",
    answerKind: "number",
    expected: 5,
    correctAnswer: "Rs. 5",
    explanation: "If the ball is Rs. 5, the bat is Rs. 105, and together they cost Rs. 110."
  },
  {
    id: "iq_q_5",
    number: 5,
    title: "Number Sequence",
    prompt: "What comes next? 1, 11, 21, 1211, 111221, ?",
    inputType: "text",
    answerKind: "sequence",
    expected: "312211",
    correctAnswer: "312211",
    explanation: "It is the look-and-say sequence. 111221 is read as three 1s, two 2s, one 1: 312211."
  },
  {
    id: "iq_q_6",
    number: 6,
    title: "Sheep Problem",
    prompt: "A farmer had 17 sheep. All but 9 died. How many sheep are left?",
    inputType: "text",
    answerKind: "number",
    expected: 9,
    correctAnswer: "9",
    explanation: "All but 9 died means 9 sheep are still alive."
  },
  {
    id: "iq_q_7",
    number: 7,
    title: "Remainder Logic",
    prompt: "A number leaves a remainder of 2 when divided by 3. Which remainder can it never leave when divided by 6?",
    inputType: "choice",
    options: {
      A: "2",
      B: "5",
      C: "4",
      D: "1"
    },
    correctOption: "C",
    correctAnswer: "4",
    explanation: "Numbers that are 2 mod 3 can only be 2 or 5 mod 6, so 4 can never happen."
  },
  {
    id: "iq_q_8",
    number: 8,
    title: "Murder Mystery",
    prompt: "A man was murdered on Sunday. Cook: I was making breakfast. Gardener: I was watering the plants. Maid: I was collecting the mail. Driver: I was washing the car. Who was it?",
    inputType: "choice",
    options: {
      A: "Cook",
      B: "Gardener",
      C: "Maid",
      D: "Driver"
    },
    correctOption: "C",
    correctAnswer: "Maid",
    explanation: "In the puzzle's logic, mail is not collected or delivered on Sunday."
  },
  {
    id: "iq_q_9",
    number: 9,
    title: "Rain Puzzle",
    prompt: "A man walked for 30 minutes in the rain without an umbrella. His clothes did not get wet. How is that possible?",
    inputType: "text",
    answerKind: "phrase",
    expected: "bald",
    correctAnswer: "He was bald.",
    explanation: "The intended riddle answer is that he was bald."
  },
  {
    id: "iq_q_10",
    number: 10,
    title: "Train Problem",
    prompt: "A train is 1 km long. It is moving at 120 km/h. It takes 30 seconds to completely pass a pole. What is the actual length of the train?",
    inputType: "choice",
    options: {
      A: "500 m",
      B: "1000 m",
      C: "1500 m",
      D: "2000 m"
    },
    correctOption: "B",
    correctAnswer: "1000 m",
    explanation: "120 km/h is 33.33 m/s. In 30 seconds the train covers about 1000 m, which is its own length when passing a pole."
  }
]);

const QUESTION_MAP = new Map(iqQuestions.map((question) => [question.id, question]));

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[₹,$%]/g, " ")
    .replace(/\brs\.?\b/g, " ")
    .replace(/[^a-z0-9.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function textWithNumberWords(value) {
  let text = normalizeText(value);
  const replacements = [
    ["one hundred fifty", "150"],
    ["hundred fifty", "150"],
    ["one fifty", "150"],
    ["thirty", "30"],
    ["five", "5"],
    ["nine", "9"],
    ["two point five", "2.5"],
    ["two and half", "2.5"],
    ["two and a half", "2.5"]
  ];
  replacements.forEach(([word, numeric]) => {
    text = text.replace(new RegExp("\\b" + word + "\\b", "g"), numeric);
  });
  return text;
}

function extractNumbers(value) {
  return (textWithNumberWords(value).match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
}

function containsExpectedNumber(answer, expected, alternate = []) {
  const numbers = extractNumbers(answer);
  return numbers.some((number) => [expected, ...alternate].some((target) => Math.abs(number - target) < 0.001));
}

function gradeChoice(question, answer) {
  const selected = String(answer?.answer || answer?.option || answer?.optionKey || "").trim().toUpperCase();
  const selectedText = normalizeText(answer?.answerText || answer?.text || answer?.value || "");
  const correctText = normalizeText(question.options?.[question.correctOption]);
  const isCorrect = selected === question.correctOption || Boolean(selectedText && selectedText === correctText);

  return {
    status: isCorrect ? "correct" : "wrong",
    points: isCorrect ? 1 : 0,
    userAnswer: selected && question.options?.[selected] ? question.options[selected] : (answer?.answerText || answer?.value || selected || ""),
    correctAnswer: question.correctAnswer,
    explanation: question.explanation
  };
}

function gradeText(question, answer) {
  const value = String(answer?.answer || answer?.value || answer?.text || "").trim();
  const normalized = textWithNumberWords(value);
  if (!value) {
    return {
      status: "wrong",
      points: 0,
      userAnswer: "",
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    };
  }

  if (question.answerKind === "number") {
    const correct = containsExpectedNumber(value, Number(question.expected));
    return {
      status: correct ? "correct" : "wrong",
      points: correct ? 1 : 0,
      userAnswer: value,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    };
  }

  if (question.answerKind === "percent") {
    const correct = containsExpectedNumber(value, 30, [0.3]);
    return {
      status: correct ? "correct" : "wrong",
      points: correct ? 1 : 0,
      userAnswer: value,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    };
  }

  if (question.answerKind === "sequence") {
    const compact = normalized.replace(/\s+/g, "");
    const correct = compact.includes(String(question.expected));
    return {
      status: correct ? "correct" : "wrong",
      points: correct ? 1 : 0,
      userAnswer: value,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    };
  }

  if (question.answerKind === "phrase") {
    const correct = /\b(bald|hairless|no hair|without hair)\b/.test(normalized);
    const close = !correct && /\b(raincoat|covered|shelter|inside|no clothes|not wearing clothes)\b/.test(normalized);
    return {
      status: correct ? "correct" : close ? "close" : "wrong",
      points: correct ? 1 : close ? 0.5 : 0,
      userAnswer: value,
      correctAnswer: question.correctAnswer,
      explanation: close
        ? question.explanation + " Your answer gives a possible protection idea, so it is marked close rather than fully correct."
        : question.explanation
    };
  }

  return {
    status: "wrong",
    points: 0,
    userAnswer: value,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation
  };
}

export function gradeIqAnswer(answer = {}) {
  const question = QUESTION_MAP.get(answer.questionId);
  if (!question) {
    return {
      questionId: answer.questionId || "unknown",
      status: "wrong",
      points: 0,
      userAnswer: String(answer.answer || answer.value || ""),
      correctAnswer: "",
      explanation: "Question was not recognized by the IQ scoring context."
    };
  }

  const graded = question.inputType === "choice" ? gradeChoice(question, answer) : gradeText(question, answer);
  return {
    questionId: question.id,
    number: question.number,
    title: question.title,
    question: question.prompt,
    inputType: question.inputType,
    ...graded
  };
}

function labelForScore(scorePercent) {
  if (scorePercent >= 90) return "Exceptional puzzle reasoning";
  if (scorePercent >= 75) return "Strong puzzle reasoning";
  if (scorePercent >= 55) return "Developing reasoning profile";
  return "Needs careful review";
}

export function scoreIqTest({ answers = [] } = {}) {
  const answerMap = new Map((Array.isArray(answers) ? answers : []).map((answer) => [answer.questionId, answer]));
  const review = iqQuestions.map((question) => gradeIqAnswer(answerMap.get(question.id) || { questionId: question.id }));
  const points = review.reduce((sum, item) => sum + Number(item.points || 0), 0);
  const total = iqQuestions.length;
  const scorePercent = Math.round((points / total) * 100);
  const correctCount = review.filter((item) => item.status === "correct").length;
  const closeCount = review.filter((item) => item.status === "close").length;
  const wrongCount = total - correctCount - closeCount;

  return {
    testType: "iq",
    instruction: IQ_GRADING_INSTRUCTION,
    totalQuestions: total,
    answeredCount: review.filter((item) => item.userAnswer).length,
    points,
    scorePercent,
    score: scorePercent,
    correctCount,
    closeCount,
    wrongCount,
    label: labelForScore(scorePercent),
    summary: "Your IQ puzzle score is based on final-answer review across logic, arithmetic, sequence, and riddle reasoning. It is not a clinical IQ diagnosis.",
    review,
    generatedAt: new Date().toISOString()
  };
}

export function createIqScoreHandler() {
  return (req, res, next) => {
    try {
      res.json(scoreIqTest(req.body || {}));
    } catch (error) {
      next(error);
    }
  };
}

export function installIqGlobals(target = globalThis) {
  target.CogniLensIQ = {
    ...(target.CogniLensIQ || {}),
    questions: iqQuestions,
    scoreIqTest,
    gradeIqAnswer
  };
}

if (typeof window !== "undefined") installIqGlobals(window);
