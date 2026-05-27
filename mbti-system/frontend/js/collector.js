(function () {
  const fallbackTypeTitles = {
    UNCL: "Not Enough Clear Signal",
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

  const behaviorMeta = {
    loyalty: "Loyalty",
    betrayalSensitivity: "Betrayal sensitivity",
    envy: "Envy pressure",
    slothRisk: "Sloth risk",
    drive: "Drive",
    impulseControl: "Impulse control",
    lustImpulse: "Attraction impulse",
    forgiveness: "Repair instinct"
  };

  const behaviorOptions = {
    P3Q6: [
      { loyalty: 8, betrayalSensitivity: 5, forgiveness: 8, impulseControl: 6 },
      { loyalty: 3, betrayalSensitivity: 9, forgiveness: 2, impulseControl: 7 },
      { loyalty: 5, betrayalSensitivity: 8, forgiveness: 4, impulseControl: 5 }
    ],
    P3Q7: [
      { loyalty: 9, drive: 5, slothRisk: 2, impulseControl: 6 },
      { loyalty: 6, drive: 8, slothRisk: 2, impulseControl: 8 },
      { loyalty: 2, drive: 3, slothRisk: 8, impulseControl: 4 }
    ],
    P3Q8: [
      { envy: 2, drive: 8, impulseControl: 7 },
      { envy: 6, drive: 9, impulseControl: 5 },
      { envy: 8, drive: 3, impulseControl: 3 }
    ],
    P3Q9: [
      { drive: 9, slothRisk: 2, impulseControl: 8 },
      { drive: 4, slothRisk: 7, impulseControl: 4 },
      { drive: 6, slothRisk: 5, impulseControl: 6 }
    ],
    P3Q10: [
      { loyalty: 9, impulseControl: 9, lustImpulse: 2, drive: 7 },
      { loyalty: 3, impulseControl: 3, lustImpulse: 8, drive: 4 },
      { loyalty: 6, impulseControl: 7, lustImpulse: 5, drive: 5 }
    ]
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

  function collectBehavioralTraits(answers = []) {
    const totals = {};
    const counts = {};
    Object.keys(behaviorMeta).forEach((key) => {
      totals[key] = 0;
      counts[key] = 0;
    });

    answers.forEach((answer) => {
      const options = behaviorOptions[answer.id] || [];
      const behavior = Number.isInteger(answer.selected) ? options[answer.selected] : null;
      if (!behavior) return;
      Object.entries(behavior).forEach(([key, value]) => {
        if (totals[key] === undefined) return;
        totals[key] += Math.max(0, Math.min(10, Number(value) || 0));
        counts[key] += 1;
      });
    });

    const scores = {};
    Object.keys(behaviorMeta).forEach((key) => {
      scores[key] = counts[key] ? Math.round((totals[key] / counts[key]) * 10) : null;
    });
    const strongest = Object.entries(scores)
      .filter(([, value]) => value !== null)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, value]) => ({ key, label: behaviorMeta[key], value }));

    return { scores, strongest, coverage: answers.filter((answer) => behaviorOptions[answer.id]).length };
  }

  function buildResult(answers = []) {
    const totals = collectDimensionTotals(answers);
    const score = typeof window.getPersonalityResult === "function"
      ? window.getPersonalityResult(totals)
      : { type: "UNCL", confidence: 0, breakdown: {}, warning: "Not enough usable answers." };
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
      behavioralTraits: collectBehavioralTraits(answers),
      source: "local",
      summary: type === "UNCL"
        ? "Not enough usable answers were found to give a reliable type."
        : `Your result is generated from four assessment phases with ${score.confidence}% local clarity. The strongest current signal is ${strongest[0]} at ${strongest[1]}%.`,
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
    collectBehavioralTraits,
    buildResult,
    analyzeWithBackend
  };
})();
