(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P6",
    name: "Phase 6 - Final",
    displayCount: "2 Questions",
    data: [
      {
        type: "select",
        q: "You made a decision that logically made sense, but people reacted negatively. What do you do next?",
        options: ["Stick with the decision because it was logically correct", "Adjust the decision to improve people's reaction", "Pause and rethink everything again"],
        traits: ["T", "F", "N"],
        explain: "Simple meaning:\nThis checks how you respond when logic and people's reactions clash. Real-life analogy: imagine you made a fair rule in a group project, but everyone feels upset. One person keeps the rule because it is logically correct, another adjusts it for people, and another pauses to rethink the whole decision."
      },
      {
        type: "select",
        q: "You followed your instinct, but it turned out wrong. What is your natural response?",
        options: ["Trust logic more next time", "Still trust your instinct", "Balance both depending on situation"],
        traits: ["T", "N", "J"],
        explain: "Simple meaning:\nThis checks how you learn after instinct fails. Real-life analogy: if you trusted your gut in a match, investment, or friendship choice and it went wrong, you might switch to logic, still trust your instinct, or learn to balance both next time."
      }
    ]
  });
})();
