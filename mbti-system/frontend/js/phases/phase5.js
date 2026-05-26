(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
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
  });
})();
