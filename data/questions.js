const toOptions = (options) => Object.freeze({ ...options });

export const mbtiQuestions = Object.freeze([
  {
    id: "mbti_q_1",
    sourceId: "P1-Q1",
    category: "mbti",
    phase: 1,
    question: "If someone keeps making the same mistake again and again, what do you secretly assume?",
    options: toOptions({
      A: "They are internally conflicted",
      B: "They are being irrational",
      C: "They do not notice it",
      D: "They have weak discipline"
    })
  },
  {
    id: "mbti_q_2",
    sourceId: "P1-Q2",
    category: "mbti",
    phase: 1,
    question: "What disturbs you more?",
    options: toOptions({
      A: "A meaningless life",
      B: "Losing control",
      C: "Emotional betrayal",
      D: "Being stuck in the same place"
    })
  },
  {
    id: "mbti_q_3",
    sourceId: "P1-Q3",
    category: "mbti",
    phase: 1,
    question: "Someone criticizes you. What is your first inner reaction?",
    options: toOptions({
      A: "Is their logic valid?",
      B: "They did not understand me",
      C: "Interesting... what is their motive?",
      D: "Fine. I can improve."
    })
  },
  {
    id: "mbti_q_4",
    sourceId: "P1-Q4",
    category: "mbti",
    phase: 1,
    question: "What does freedom mean to you?",
    options: toOptions({
      A: "Not being controlled by anyone",
      B: "Being able to think freely",
      C: "Keeping your own identity",
      D: "Exploring without restrictions"
    })
  },
  {
    id: "mbti_q_5",
    sourceId: "P1-Q5",
    category: "mbti",
    phase: 1,
    question: "If you built an AI, what would you prioritize first?",
    options: toOptions({
      A: "Independent reasoning",
      B: "Efficiency and output",
      C: "Understanding humans",
      D: "Creativity and adaptation"
    })
  },
  {
    id: "mbti_q_6",
    sourceId: "P2-Q1",
    category: "mbti",
    phase: 2,
    question: "You are leading a group project. One incompetent person is slowing everything down. Realistically, what would you do?",
    options: toOptions({
      A: "Quietly replace them",
      B: "Finish the work yourself",
      C: "Try to help them improve",
      D: "Ignore them and improve the system"
    })
  },
  {
    id: "mbti_q_7",
    sourceId: "P2-Q2",
    category: "mbti",
    phase: 2,
    question: "Which type of people irritate you most?",
    options: toOptions({
      A: "People who overreact emotionally",
      B: "People who act superior without real skill",
      C: "People who manipulate others",
      D: "People who follow rules without thinking"
    })
  },
  {
    id: "mbti_q_8",
    sourceId: "P2-Q3",
    category: "mbti",
    phase: 2,
    question: "If your prediction turns out wrong, what do you do?",
    options: toOptions({
      A: "Admit it openly",
      B: "Re-analyze it privately",
      C: "Try to justify it",
      D: "Build a new framework immediately"
    })
  },
  {
    id: "mbti_q_9",
    sourceId: "P2-Q4",
    category: "mbti",
    phase: 2,
    question: "What secretly makes you feel validated?",
    options: toOptions({
      A: "You are intelligent.",
      B: "You are reliable.",
      C: "You are unique.",
      D: "You understand people."
    })
  },
  {
    id: "mbti_q_10",
    sourceId: "P2-Q5",
    category: "mbti",
    phase: 2,
    question: "What is your biggest hidden fear?",
    options: toOptions({
      A: "Becoming average",
      B: "Losing control",
      C: "Being emotionally exposed",
      D: "Choosing the wrong life"
    })
  },
  {
    id: "mbti_q_11",
    sourceId: "P3-Q1",
    category: "mbti",
    phase: 3,
    question: "You can do a dangerous experiment that could advance humanity, but some people might die. Would you do it?",
    options: toOptions({
      A: "Yes",
      B: "No"
    })
  },
  {
    id: "mbti_q_12",
    sourceId: "P3-Q2",
    category: "mbti",
    phase: 3,
    question: "What does intelligence mean to you?",
    options: toOptions({
      A: "Prediction",
      B: "Adaptation",
      C: "Understanding",
      D: "Execution"
    })
  },
  {
    id: "mbti_q_18",
    sourceId: "P3-Q3",
    category: "mbti",
    phase: 3,
    question: "In emergencies what do you notice first?",
    options: toOptions({
      A: "Immediate physical danger",
      B: "Hidden meaning",
      C: "Emotional reactions",
      D: "Long-term implications"
    })
  },
  {
    id: "mbti_q_19",
    sourceId: "P3-Q4",
    category: "mbti",
    phase: 3,
    question: "When stressed, where do you naturally return?",
    options: toOptions({
      A: "Familiar routines",
      B: "New possibilities",
      C: "Isolation and thought",
      D: "Immediate action"
    })
  },
  {
    id: "mbti_q_13",
    sourceId: "P4-Q1",
    category: "mbti",
    phase: 4,
    question: "A train accident is about to happen. You can save one genius scientist or five normal strangers.",
    options: toOptions({
      A: "Save the scientist",
      B: "Save the five strangers",
      C: "Depends on long-term impact",
      D: "Freeze"
    })
  },
  {
    id: "mbti_q_14",
    sourceId: "P4-Q2",
    category: "mbti",
    phase: 4,
    question: "You can press a button that reduces crime by 80%, but everyone's privacy is permanently destroyed.",
    options: toOptions({
      A: "Press it",
      B: "Do not press it",
      C: "Use a modified system",
      D: "Depends on who controls it"
    })
  },
  {
    id: "mbti_q_15",
    sourceId: "P4-Q3",
    category: "mbti",
    phase: 4,
    question: "Your close friend does something illegal with a good intention.",
    options: toOptions({
      A: "Report them",
      B: "Protect them",
      C: "Confront them privately",
      D: "Ignore it until consequences appear"
    })
  },
  {
    id: "mbti_q_16",
    sourceId: "P4-Q4",
    category: "mbti",
    phase: 4,
    question: "Someone will save millions of people in the future, but they are doing terrible things right now. What would you do?",
    options: toOptions({
      A: "Stop them now",
      B: "Allow them for a while",
      C: "Influence the outcome carefully",
      D: "Not sure"
    })
  },
  {
    id: "mbti_q_17",
    sourceId: "P4-Q5",
    category: "mbti",
    phase: 4,
    question: "You can delete one memory. Your life would become happier, but you would become a different person.",
    options: toOptions({
      A: "Delete it",
      B: "Keep it",
      C: "Partially erase it",
      D: "Depends on which memory"
    })
  }
]);

export const eqQuestions = Object.freeze([
  {
    id: "eq_q_1",
    sourceId: "EQ1",
    category: "eq",
    phase: 1,
    question: "Which type of person feels emotionally dangerous to you?",
    options: toOptions({
      A: "Too charming",
      B: "Too logical",
      C: "Too emotional",
      D: "Too quiet"
    })
  },
  {
    id: "eq_q_2",
    sourceId: "EQ2",
    category: "eq",
    phase: 1,
    question: "Which weather feels emotionally attractive to you?",
    options: toOptions({
      A: "Thunderstorm",
      B: "Cold winter",
      C: "Bright sunlight",
      D: "Fog"
    })
  },
  {
    id: "eq_q_3",
    sourceId: "EQ3",
    category: "eq",
    phase: 1,
    question: "What feels more uncomfortable to you?",
    options: toOptions({
      A: "Being judged",
      B: "Being ignored",
      C: "Being controlled",
      D: "Being misunderstood"
    })
  },
  {
    id: "eq_q_4",
    sourceId: "EQ4",
    category: "eq",
    phase: 1,
    question: "What kind of memories does your brain revisit?",
    options: toOptions({
      A: "Embarrassing moments",
      B: "Emotional moments",
      C: "Missed opportunities",
      D: "Unsolved situations"
    })
  },
  {
    id: "eq_q_5",
    sourceId: "EQ5",
    category: "eq",
    phase: 1,
    question: "What kind of energy naturally drains you?",
    options: toOptions({
      A: "Fake positivity",
      B: "Emotional dependency",
      C: "Constant unpredictability",
      D: "Lack of meaning"
    })
  },
  {
    id: "eq_q_6",
    sourceId: "EQ6",
    category: "eq",
    phase: 2,
    question: "Which line hurts you the most?",
    options: toOptions({
      A: "You're useless.",
      B: "You're fake.",
      C: "You're replaceable.",
      D: "You don't matter."
    })
  },
  {
    id: "eq_q_7",
    sourceId: "EQ7",
    category: "eq",
    phase: 2,
    question: "What do you secretly see as weakness?",
    options: toOptions({
      A: "Emotional dependency",
      B: "Lack of intelligence",
      C: "Lack of control",
      D: "Needing validation"
    })
  },
  {
    id: "eq_q_8",
    sourceId: "EQ8",
    category: "eq",
    phase: 2,
    question: "If you are the smartest person in the room, how do you feel?",
    options: toOptions({
      A: "Excited",
      B: "Bored",
      C: "Suspicious",
      D: "Responsible"
    })
  },
  {
    id: "eq_q_9",
    sourceId: "EQ9",
    category: "eq",
    phase: 2,
    question: "If you lose trust in someone, what do you do?",
    options: toOptions({
      A: "Disconnect instantly",
      B: "Give one last chance",
      C: "Quietly reduce attachment",
      D: "Test them mentally"
    })
  },
  {
    id: "eq_q_10",
    sourceId: "EQ10",
    category: "eq",
    phase: 2,
    question: "If everyone suddenly disappeared, how would you feel?",
    options: toOptions({
      A: "Peaceful",
      B: "Empty",
      C: "Curious",
      D: "Free"
    })
  },
  {
    id: "eq_q_11",
    sourceId: "EQ14",
    category: "eq",
    phase: 3,
    question: "If you could save only one person, an elderly person or a young child, would you choose the child?",
    options: toOptions({
      A: "Yes",
      B: "No"
    })
  },
  {
    id: "eq_q_12",
    sourceId: "EQ15",
    category: "eq",
    phase: 3,
    question: "If saving five children meant one elderly person would die, would you still save the five children?",
    options: toOptions({
      A: "Yes",
      B: "No"
    })
  },
  {
    id: "eq_q_13",
    sourceId: "EQ16",
    category: "eq",
    phase: 3,
    question: "If you had to choose between saving five elderly people or one child, would you still choose the child?",
    options: toOptions({
      A: "Yes",
      B: "No"
    })
  },
  {
    id: "eq_q_14",
    sourceId: "EQ17",
    category: "eq",
    phase: 3,
    question: "Do you think someone who committed a very serious crime still has the right to live?",
    options: toOptions({
      A: "Yes",
      B: "No"
    })
  },
  {
    id: "eq_q_15",
    sourceId: "EQ18",
    category: "eq",
    phase: 3,
    question: "If you did something that deeply hurt your parents, would you tell them the truth?",
    options: toOptions({
      A: "Yes",
      B: "No"
    })
  },
  {
    id: "eq_q_16",
    sourceId: "EQ19",
    category: "eq",
    phase: 3,
    question: "If telling the truth could ruin someone's life, would you still tell it?",
    options: toOptions({
      A: "Yes",
      B: "No"
    })
  },
  {
    id: "eq_q_17",
    sourceId: "EQ20",
    category: "eq",
    phase: 3,
    question: "If giving up your own happiness could make many people happy, would you do it?",
    options: toOptions({
      A: "Yes",
      B: "No"
    })
  }
]);


export const iqQuestions = Object.freeze([
  {
    id: "iq_q_1",
    sourceId: "IQ1",
    category: "iq",
    phase: 1,
    question: "A room contains 100 people. Each person shook hands with exactly 3 other people in the room. How many handshakes took place?",
    answerType: "text"
  },
  {
    id: "iq_q_2",
    sourceId: "IQ2",
    category: "iq",
    phase: 1,
    question: "I thought of a number. Multiplied it by 2, added 5, divided by 2, then subtracted the original number. What is the result?",
    options: toOptions({ A: "Depends on the number", B: "2", C: "2.5", D: "5" })
  },
  {
    id: "iq_q_3",
    sourceId: "IQ3",
    category: "iq",
    phase: 1,
    question: "In a village, 60% of people drink tea and 70% drink coffee. What is the minimum percentage of people who drink both tea and coffee?",
    answerType: "text"
  },
  {
    id: "iq_q_4",
    sourceId: "IQ4",
    category: "iq",
    phase: 1,
    question: "A bat and a ball cost Rs. 110 in total. The bat costs Rs. 100 more than the ball. How much does the ball cost?",
    answerType: "text"
  },
  {
    id: "iq_q_5",
    sourceId: "IQ5",
    category: "iq",
    phase: 1,
    question: "What comes next? 1, 11, 21, 1211, 111221, ?",
    answerType: "text"
  },
  {
    id: "iq_q_6",
    sourceId: "IQ6",
    category: "iq",
    phase: 1,
    question: "A farmer had 17 sheep. All but 9 died. How many sheep are left?",
    answerType: "text"
  },
  {
    id: "iq_q_7",
    sourceId: "IQ7",
    category: "iq",
    phase: 1,
    question: "A number leaves a remainder of 2 when divided by 3. Which remainder can it never leave when divided by 6?",
    options: toOptions({ A: "2", B: "5", C: "4", D: "1" })
  },
  {
    id: "iq_q_8",
    sourceId: "IQ8",
    category: "iq",
    phase: 1,
    question: "A man was murdered on Sunday. Cook: I was making breakfast. Gardener: I was watering the plants. Maid: I was collecting the mail. Driver: I was washing the car. Who was it?",
    options: toOptions({ A: "Cook", B: "Gardener", C: "Maid", D: "Driver" })
  },
  {
    id: "iq_q_9",
    sourceId: "IQ9",
    category: "iq",
    phase: 1,
    question: "A man walked for 30 minutes in the rain without an umbrella. His clothes did not get wet. How is that possible?",
    answerType: "text"
  },
  {
    id: "iq_q_10",
    sourceId: "IQ10",
    category: "iq",
    phase: 1,
    question: "A train is 1 km long. It is moving at 120 km/h. It takes 30 seconds to completely pass a pole. What is the actual length of the train?",
    options: toOptions({ A: "500 m", B: "1000 m", C: "1500 m", D: "2000 m" })
  }
]);

export const questions = Object.freeze([...mbtiQuestions, ...eqQuestions, ...iqQuestions]);
export const questionsByCategory = Object.freeze({
  mbti: mbtiQuestions,
  eq: eqQuestions,
  iq: iqQuestions
});

export function getQuestionsByCategory(category = "mbti") {
  return questionsByCategory[category] || [];
}

if (typeof window !== "undefined") {
  window.CogniLensData = {
    ...(window.CogniLensData || {}),
    questions: questionsByCategory,
    questionList: questions,
    allQuestions: questions,
    mbtiQuestions,
    eqQuestions,
    iqQuestions
  };
}
