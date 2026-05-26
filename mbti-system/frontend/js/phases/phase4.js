(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P4",
    name: "Phase 4 - Pressure",
    displayCount: "4 Questions",
    data: [
      {
        type: "select",
        q: "If telling the truth could break a relationship, would you still tell the truth?",
        options: ["Yes", "No"],
        traits: ["T", "F"],
        explain: "Simple meaning:\nThis checks how you handle truth when emotions are at risk. Real-life analogy: imagine your close friend asks for honest feedback that may hurt them. A truth-first person says it clearly because honesty matters. A relationship-protective person may soften it, delay it, or avoid saying it directly."
      },
      {
        type: "select",
        q: "What would you choose more often?",
        options: ["Controlling the future", "Enjoying the present"],
        traits: ["J", "P"],
        explain: "Simple meaning:\nThis checks whether your mind wants security and planning or freedom and experience. Real-life analogy: one person saves money, plans the next five years, and wants control. Another wants to enjoy today's moment, travel, explore, and not over-plan everything."
      },
      {
        type: "select",
        q: "When a problem appears, what do you usually do?",
        options: ["Face it", "Avoid it"],
        traits: ["E", "I"],
        explain: "Simple meaning:\nThis checks your first reaction to discomfort. Real-life analogy: if there is a difficult call or conflict, some people handle it directly even if it feels uncomfortable. Others step back, delay it, or avoid it until they feel ready."
      },
      {
        type: "select",
        q: "What would you choose more often?",
        options: ["Staying safe", "Taking a risk"],
        traits: ["J", "P"],
        explain: "Simple meaning:\nThis checks your comfort with uncertainty. Real-life analogy: choosing a stable job is like staying on a known road with clear signs. Taking a risky opportunity is like entering a new road where the reward may be higher, but the outcome is less certain."
      }
    ]
  });
})();
