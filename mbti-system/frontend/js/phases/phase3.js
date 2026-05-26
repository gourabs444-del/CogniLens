(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P3",
    name: "Phase 3 - Moral",
    displayCount: "3 Questions",
    data: [
      {
        type: "select",
        q: "If you had to choose between saving one close person or five strangers, what would you do?",
        options: ["Save five strangers", "Save the close person", "It depends on the situation"],
        traits: ["F", "I", "N"],
        explain: "Simple meaning:\nImagine you can help only one side.\nOne choice helps more people.\nOne choice helps someone close.\nThe third means you need more details first."
      },
      {
        type: "select",
        q: "If telling the truth could hurt someone badly, what would you do?",
        options: ["Tell the truth anyway", "Hide or soften the truth", "Choose based on situation"],
        traits: ["T", "F", "N"],
        explain: "Simple meaning:\nSometimes truth can hurt feelings.\nOne answer says truth first.\nOne answer says protect feelings.\nOne answer says decide after seeing the situation."
      },
      {
        type: "select",
        q: "If breaking a rule could help many people, what would you do?",
        options: ["Follow the rule no matter what", "Break the rule to help others", "Decide based on the situation"],
        traits: ["J", "F", "N"],
        explain: "Simple meaning:\nA rule says no, but people need help.\nOne answer follows the rule.\nOne answer helps people.\nOne answer checks the full situation first."
      }
    ]
  });
})();
