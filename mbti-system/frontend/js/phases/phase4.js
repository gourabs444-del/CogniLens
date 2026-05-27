(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P4",
    name: "Phase 4 - Rapid Fire",
    displayCount: "5 Timed Questions",
    data: [
      {
        id: "P4Q1",
        type: "select",
        customInput: false,
        timeLimit: 2,
        q: "Right or Kind?",
        options: ["Right", "Kind"],
        traits: ["T", "F"],
        explain: ""
      },
      {
        id: "P4Q2",
        type: "select",
        customInput: false,
        timeLimit: 2,
        q: "Truth or Comfort?",
        options: ["Truth", "Comfort"],
        traits: ["T", "F"],
        explain: ""
      },
      {
        id: "P4Q3",
        type: "select",
        customInput: false,
        timeLimit: 2,
        q: "Plan or Flow?",
        options: ["Plan", "Flow"],
        traits: ["J", "P"],
        explain: ""
      },
      {
        id: "P4Q4",
        type: "select",
        customInput: false,
        timeLimit: 2,
        q: "Respect or Love?",
        options: ["Respect", "Love"],
        traits: ["T", "F"],
        explain: ""
      },
      {
        id: "P4Q5",
        type: "select",
        customInput: false,
        timeLimit: 2,
        q: "Alone or People?",
        options: ["Alone", "People"],
        traits: ["I", "E"],
        explain: ""
      }
    ]
  });
})();
