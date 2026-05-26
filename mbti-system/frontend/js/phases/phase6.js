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
        explain: "Simple meaning:\nYour choice made sense, but people got upset.\nDo you keep it, change it, or stop and think again?"
      },
      {
        type: "select",
        q: "You followed your instinct, but it turned out wrong. What is your natural response?",
        options: ["Trust logic more next time", "Still trust your instinct", "Balance both depending on situation"],
        traits: ["T", "N", "J"],
        explain: "Simple meaning:\nYour feeling told you to do something, but it went wrong.\nNext time, do you trust logic, trust feeling again, or use both?"
      }
    ]
  });
})();
