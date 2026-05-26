(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P1",
    name: "Phase 1 - Core",
    displayCount: "6 Questions",
    data: [
      {
        type: "select",
        customInput: true,
        q: "When starting a task, you usually:",
        options: ["Make a clear plan first", "Start and adjust as you go"],
        traits: ["J", "P"],
        explain: "Simple meaning:\nThis checks whether you naturally prefer planning before action or learning while moving."
      },
      {
        type: "select",
        customInput: true,
        q: "When making decisions, you rely more on:",
        options: ["Logic and facts", "Feelings and situation"],
        traits: ["T", "F"],
        explain: "Simple meaning:\nThis checks whether your first decision filter is objective logic or personal/emotional context."
      },
      {
        type: "select",
        customInput: true,
        q: "You're more interested in:",
        options: ["Practical things that are directly useful", "Ideas and possibilities"],
        traits: ["S", "N"],
        explain: "Simple meaning:\nThis checks whether your attention goes first to real-world usefulness or future possibilities."
      },
      {
        type: "select",
        customInput: true,
        q: "In your free time, you naturally:",
        options: ["Stay engaged on your own", "Connect with others"],
        traits: ["I", "E"],
        explain: "Simple meaning:\nThis checks whether your energy usually refills through solo focus or social connection."
      },
      {
        type: "select",
        customInput: true,
        q: "When there's a deadline:",
        options: ["You finish early or on time", "You work best close to the deadline"],
        traits: ["J", "P"],
        explain: "Simple meaning:\nThis checks whether you naturally close tasks early or rely on last-minute pressure."
      },
      {
        type: "select",
        customInput: true,
        q: "When something is unclear:",
        options: ["You decide quickly and move on", "You explore more before deciding"],
        traits: ["J", "P"],
        explain: "Simple meaning:\nThis checks whether you prefer closure quickly or keeping options open until more is explored."
      }
    ]
  });
})();
