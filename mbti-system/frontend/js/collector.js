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
      honesty: null,
      breakdown: score.breakdown,
      warning: score.warning,
      metrics,
      totals,
      answers,
      title,
      source: "local",
      summary: `Your result is generated from four assessment phases with ${score.confidence}% local clarity. The strongest current signal is ${strongest[0]} at ${strongest[1]}%.`,
      tags: ["Four-phase", "Self-aware", "Story-ready"]
    };
  }

  function getApiBaseUrl() {
    const fromWindow = window.COGNILENS_API_BASE_URL;
    const fromStorage = (() => {
      try {
        return window.localStorage?.getItem("cognilensApiBaseUrl");
      } catch (error) {
        return "";
      }
    })();
    return String(fromWindow || fromStorage || "http://localhost:8000").replace(/\/+$/, "");
  }

  function normalizeBackendResult(result, answers, fallbackResult) {
    const summary = result.summary || result.insight?.summary || fallbackResult.summary;
    const tags = result.tags?.length
      ? result.tags
      : ["Hybrid engine", `${Math.round(result.honesty ?? 0)}% honesty`, "Four-phase"];

    return {
      ...fallbackResult,
      ...result,
      answers,
      summary,
      tags,
      source: result.source || "backend",
      backendUrl: getApiBaseUrl()
    };
  }

  async function analyzeWithBackend(answers = [], fallbackResult = buildResult(answers)) {
    const response = await fetch(`${getApiBaseUrl()}/api/mbti/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(body || `Backend analysis failed with HTTP ${response.status}.`);
    }

    const result = await response.json();
    return normalizeBackendResult(result, answers, fallbackResult);
  }

  window.CogniLensCollector = {
    collectDimensionTotals,
    buildResult,
    analyzeWithBackend
  };
})();
