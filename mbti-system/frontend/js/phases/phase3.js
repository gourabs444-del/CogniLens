(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P3",
    name: "Phase 3 - Context Check",
    displayCount: "5 Questions",
    data: [
      {
        type: "select",
        q: "After spending a long time with people, what do you usually feel?",
        options: ["I feel tired", "I feel energetic"],
        traits: ["I", "E"],
        explain: "Simple meaning:\nThis checks what social interaction does to your energy. Real-life analogy: after a long family function or hangout, some people need silence and personal space to recover. Others come home more excited and feel like the interaction charged them."
      },
      {
        type: "select",
        q: "Honestly, when do you usually complete most of your work?",
        options: ["Before the deadline", "At the last moment"],
        traits: ["J", "P"],
        explain: "Simple meaning:\nThis checks your real working rhythm, not your ideal answer. Real-life analogy: for an assignment, some people finish early and relax later. Others wait until the pressure is real, then suddenly become fast and focused."
      },
      {
        type: "select",
        q: "When making a decision, what do you depend on more?",
        options: ["Logic", "Feelings"],
        traits: ["T", "F"],
        explain: "Simple meaning:\nThis checks what you trust first when both facts and emotions are present. Real-life analogy: if two friends are arguing, one person asks, 'What exactly happened and what is fair?' Another asks, 'Who is hurt and how can this be handled gently?'"
      },
      {
        type: "select",
        q: "If you started a company, what would you focus on more?",
        options: ["Profit, strategy, logical growth", "Employees, culture, people satisfaction"],
        traits: ["T", "F"],
        explain: "Simple meaning:\nThis checks how you balance results and people when responsibility gets bigger. Real-life analogy: as a founder, one person first looks at revenue, market position, systems, and growth. Another first asks whether the team feels respected, motivated, and emotionally safe."
      },
      {
        type: "select",
        q: "If you led a political party, what would you focus on more?",
        options: ["Strong decisions, rules, system", "Public emotions, people connect"],
        traits: ["T", "F"],
        explain: "Simple meaning:\nThis asks the same trait in a different context to check consistency. Real-life analogy: a strict leader may focus on law, order, discipline, and systems. A people-connect leader may focus on public emotion, trust, belonging, and how people feel about decisions."
      }
    ]
  });
})();
