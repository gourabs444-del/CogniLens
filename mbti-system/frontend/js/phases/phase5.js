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
        explain: "Simple meaning:\nThis checks your real pressure behavior, not the perfect answer. Real-life analogy: when something suddenly goes wrong, some people pause and think, some act immediately, and some look around to understand what others are doing before choosing their move."
      },
      {
        type: "select",
        q: "When things don't go as planned, what is your natural reaction?",
        options: ["Try to fix it logically step by step", "Adapt quickly and try something else", "Wait and observe before acting"],
        traits: ["T", "P", "I"],
        explain: "Simple meaning:\nThis checks how you recover when your plan breaks. Real-life analogy: if your travel plan fails, one person rebuilds the route step by step, another quickly changes destination or method, and another waits, observes, and decides after more clarity."
      }
    ]
  });
})();
