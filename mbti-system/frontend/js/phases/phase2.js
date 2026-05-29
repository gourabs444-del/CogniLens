(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P2",
    name: "Phase 2 - Preferences",
    displayCount: "5 Questions",
    data: [
      {
        id: "P2-Q1",
        type: "select",
        q: "You are leading a group project. One incompetent person is slowing everything down. Realistically, what would you do?",
        options: [
          "Quietly replace them",
          "Finish the work yourself",
          "Try to help them improve",
          "Ignore them and improve the system"
        ],
        traits: [],
        customInput: false,
        explain: "This means: if one teammate is making the work slow, what would you most likely do?"
      },
      {
        id: "P2-Q2",
        type: "select",
        q: "Which type of people irritate you most?",
        options: [
          "People who overreact emotionally",
          "People who act superior without real skill",
          "People who manipulate others",
          "People who follow rules without thinking"
        ],
        traits: [],
        customInput: false,
        explain: "This means: which kind of person makes you annoyed the fastest?"
      },
      {
        id: "P2-Q3",
        type: "select",
        q: "If your prediction turns out wrong, what do you do?",
        options: [
          "Admit it openly",
          "Re-analyze it privately",
          "Try to justify it",
          "Build a new framework immediately"
        ],
        traits: [],
        customInput: false,
        explain: "This means: when your guess is wrong, what do you usually do next?"
      },
      {
        id: "P2-Q4",
        type: "select",
        q: "What secretly makes you feel validated?",
        options: [
          "You are intelligent.",
          "You are reliable.",
          "You are unique.",
          "You understand people."
        ],
        traits: [],
        customInput: false,
        explain: "This means: which compliment makes you feel good inside?"
      },
      {
        id: "P2-Q5",
        type: "select",
        q: "What is your biggest hidden fear?",
        options: [
          "Becoming average",
          "Losing control",
          "Being emotionally exposed",
          "Choosing the wrong life"
        ],
        traits: [],
        customInput: false,
        explain: "This means: which worry quietly scares you the most?"
      }
    ]
  });
})();