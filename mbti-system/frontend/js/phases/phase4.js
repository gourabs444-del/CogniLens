(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P4",
    name: "Phase 4 - Quick Choices",
    displayCount: "5 Questions",
    data: [
      {
        id: "P4-Q1",
        type: "select",
        q: "A train accident is about to happen. You can save one genius scientist or five normal strangers.",
        options: [
          "Save the scientist",
          "Save the five strangers",
          "Depends on long-term impact",
          "Freeze"
        ],
        traits: [],
        customInput: false,
        explain: "This means: if you can save only one side, which choice feels right in that moment?"
      },
      {
        id: "P4-Q2",
        type: "select",
        q: "You can press a button that reduces crime by 80%, but everyone's privacy is permanently destroyed.",
        options: [
          "Press it",
          "Do not press it",
          "Use a modified system",
          "Depends on who controls it"
        ],
        traits: [],
        customInput: false,
        explain: "This means: would you trade privacy for a safer world?"
      },
      {
        id: "P4-Q3",
        type: "select",
        q: "Your close friend does something illegal with a good intention.",
        options: [
          "Report them",
          "Protect them",
          "Confront them privately",
          "Ignore it until consequences appear"
        ],
        traits: [],
        customInput: false,
        explain: "This means: if a friend breaks a rule while trying to help, what would you do?"
      },
      {
        id: "P4-Q4",
        type: "select",
        q: "Someone will save millions of people in the future, but they are doing terrible things right now. What would you do?",
        options: [
          "Stop them now",
          "Allow them for a while",
          "Manipulate the outcome",
          "Not sure"
        ],
        traits: [],
        customInput: false,
        explain: "This means: would you stop a bad action now, even if that person may help many people later?"
      },
      {
        id: "P4-Q5",
        type: "select",
        q: "You can delete one memory. Your life would become happier, but you would become a different person.",
        options: [
          "Delete it",
          "Keep it",
          "Partially erase it",
          "Depends on which memory"
        ],
        traits: [],
        customInput: false,
        explain: "This means: would you remove a painful memory if it also changed who you are?"
      }
    ]
  });
})();