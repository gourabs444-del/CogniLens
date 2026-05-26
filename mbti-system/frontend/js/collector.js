(function () {
  const fallbackTypeTitles = {
    ISTJ: "Practical Systems Guardian",
    ISFJ: "Supportive Detail Keeper",
    INFJ: "Insightful Purpose Builder",
    INTJ: "Strategic Systems Thinker",
    ISTP: "Precise Tactical Solver",
    ISFP: "Grounded Creative Observer",
    INFP: "Reflective Values Explorer",
    INTP: "Analytical Pattern Architect",
    ESTP: "Action-Oriented Problem Mover",
    ESFP: "Expressive Experience Driver",
    ENFP: "Possibility-Focused Connector",
    ENTP: "Inventive Challenge Solver",
    ESTJ: "Structured Execution Leader",
    ESFJ: "Collaborative Support Organizer",
    ENFJ: "People-Centered Vision Guide",
    ENTJ: "Decisive Strategy Builder"
  };

  function collectDimensionTotals(answers = []) {
    const totals = { I: 0, E: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };
    answers.forEach((answer) => {
      (answer.values || []).forEach((value, index) => {
        const trait = answer.traits?.[index];
        if (trait && totals[trait] !== undefined) totals[trait] += Number(value) || 0;
      });
    });
    return totals;
  }

  function buildResult(answers = []) {
    const totals = collectDimensionTotals(answers);
    const score = typeof window.getPersonalityResult === "function"
      ? window.getPersonalityResult(totals)
      : { type: "INTJ", confidence: 0, breakdown: {}, warning: null };
    const metrics = typeof window.getPersonalityMetrics === "function"
      ? window.getPersonalityMetrics(totals)
      : { I: 50, N: 50, T: 50, J: 50 };
    const type = score.type;
    const strongest = Object.entries(metrics).sort((a, b) => Math.abs(b[1] - 50) - Math.abs(a[1] - 50))[0] || ["I", 50];
    const title = typeof window.getPersonalityTitle === "function"
      ? window.getPersonalityTitle(type)
      : (fallbackTypeTitles[type] || `${type || "Adaptive"} Personality Profile`);

    return {
      type,
      confidence: score.confidence,
      breakdown: score.breakdown,
      warning: score.warning,
      metrics,
      totals,
      answers,
      title,
      summary: `Your result is generated from six assessment phases with ${score.confidence}% confidence. The strongest current signal is ${strongest[0]} at ${strongest[1]}%.`,
      tags: ["Six-phase", "Self-aware", "Story-ready"]
    };
  }

  window.CogniLensCollector = {
    collectDimensionTotals,
    buildResult
  };
})();
