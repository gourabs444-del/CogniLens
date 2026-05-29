(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P1",
    name: "Phase 1 - Core",
    displayCount: "5 Questions",
    data: [
      {
        id: "P1-Q1",
        type: "select",
        q: "If someone keeps making the same mistake again and again, what do you secretly assume?",
        options: [
          "They are internally conflicted",
          "They are being irrational",
          "They do not notice it",
          "They have weak discipline"
        ],
        traits: [],
        customInput: false,
        explain: "This means: when someone repeats a mistake, what simple reason comes to your mind first?"
      },
      {
        id: "P1-Q2",
        type: "select",
        q: "What disturbs you more?",
        options: [
          "A meaningless life",
          "Losing control",
          "Emotional betrayal",
          "Being stuck in the same place"
        ],
        traits: [],
        customInput: false,
        explain: "This means: which feeling bothers your heart or mind the most?"
      },
      {
        id: "P1-Q3",
        type: "select",
        q: "Someone criticizes you. What is your first inner reaction?",
        options: [
          "Is their logic valid?",
          "They did not understand me",
          "Interesting... what is their motive?",
          "Fine. I can improve."
        ],
        traits: [],
        customInput: false,
        explain: "This means: when someone says something negative about you, what is your first thought inside?"
      },
      {
        id: "P1-Q4",
        type: "select",
        q: "What does freedom mean to you?",
        options: [
          "Not being controlled by anyone",
          "Being able to think freely",
          "Keeping your own identity",
          "Exploring without restrictions"
        ],
        traits: [],
        customInput: false,
        explain: "This means: what makes you feel free, like you can be yourself?"
      },
      {
        id: "P1-Q5",
        type: "select",
        q: "If you built an AI, what would you prioritize first?",
        options: [
          "Independent reasoning",
          "Efficiency and output",
          "Understanding humans",
          "Creativity and adaptation"
        ],
        traits: [],
        customInput: false,
        explain: "This means: if you made a smart helper, what would you want it to be best at first?"
      }
    ]
  });
})();