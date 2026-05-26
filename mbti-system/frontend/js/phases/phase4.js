(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P4",
    name: "Phase 4 - Pressure",
    displayCount: "2 Timed Questions",
    data: [
      {
        type: "select",
        timeLimit: 10,
        q: "Quick! Someone insults you publicly. What do you do first?",
        options: ["Ignore and stay calm", "Respond immediately", "Think before reacting"],
        traits: ["I", "E", "T"],
        explain: "Simple meaning:\nSomeone says something bad in front of people.\nWhat is your first quick reaction?\nChoose the answer that feels most natural."
      },
      {
        type: "select",
        timeLimit: 10,
        q: "You must decide quickly. Trust what?",
        options: ["Logic", "Gut feeling", "People around you"],
        traits: ["T", "N", "F"],
        explain: "Simple meaning:\nYou must choose fast.\nWhat do you trust first?\nLogic = facts. Gut = inner feeling. People = what others say."
      }
    ]
  });
})();
