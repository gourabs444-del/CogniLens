(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P3",
    name: "Phase 3 - Real Situations",
    displayCount: "4 Questions",
    data: [
      {
        id: "P3-Q1",
        type: "select",
        q: "You can do a dangerous experiment that could advance humanity, but some people might die. Would you do it?",
        options: [
          "Yes",
          "No"
        ],
        traits: [],
        customInput: false,
        explain: "This means: if something could help many people but may hurt some people, would you still do it?"
      },
      {
        id: "P3-Q2",
        type: "select",
        q: "What does intelligence mean to you?",
        options: [
          "Prediction",
          "Adaptation",
          "Understanding",
          "Execution"
        ],
        traits: [],
        customInput: false,
        explain: "This means: when you hear the word smart, what ability do you think of first?"
      },
      {
        id: "P3-Q3",
        type: "select",
        q: "In emergencies what do you notice first?",
        options: [
          "Immediate physical danger",
          "Hidden meaning",
          "Emotional reactions",
          "Long-term implications"
        ],
        traits: [],
        customInput: false,
        explain: "This means: when something urgent happens, what catches your mind first?"
      },
      {
        id: "P3-Q4",
        type: "select",
        q: "When stressed, where do you naturally return?",
        options: [
          "Familiar routines",
          "New possibilities",
          "Isolation and thought",
          "Immediate action"
        ],
        traits: [],
        customInput: false,
        explain: "This means: when pressure is high, what feels most natural for you to do?"
      }
    ]
  });
})();