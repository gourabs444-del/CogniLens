(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P1",
    name: "Phase 1 - Core",
    displayCount: "6 Questions",
    data: [
      {
        id: "P1Q1",
        type: "select",
        customInput: true,
        q: "When starting a task, you usually:",
        options: ["Make a clear plan first", "Start and adjust as you go"],
        traits: ["J", "P"],
        explain: "Simple example:\nImagine you are going on a trip. Some people first make a route, packing list, and timing plan. Others start the journey and adjust when they see traffic, weather, or better options. Pick the one that feels closer to your normal style."
      },
      {
        id: "P1Q2",
        type: "select",
        customInput: true,
        q: "When making decisions, you rely more on:",
        options: ["Logic and facts", "Feelings and situation"],
        traits: ["T", "F"],
        explain: "Simple example:\nImagine you are buying a phone. One person first compares price, battery, camera, and performance. Another person also notices comfort, mood, look, and whether it fits their daily life. Choose what you usually do first."
      },
      {
        id: "P1Q3",
        type: "select",
        customInput: true,
        q: "You're more interested in:",
        options: ["Practical things that are directly useful", "Ideas and possibilities"],
        traits: ["S", "N"],
        explain: "Simple example:\nIf someone shows you a new gadget, one person asks, 'How will this help me today?' Another asks, 'What could this become in the future?' Choose the reaction that feels more natural to you."
      },
      {
        id: "P1Q4",
        type: "select",
        customInput: true,
        q: "In your free time, you naturally:",
        options: ["Stay engaged on your own", "Connect with others"],
        traits: ["I", "E"],
        explain: "Simple example:\nAfter a busy week, some people feel better with gaming, music, coding, or quiet time alone. Others feel fresh after calling friends, chatting, or going out. Choose what usually recharges you."
      },
      {
        id: "P1Q5",
        type: "select",
        customInput: true,
        q: "When there's a deadline:",
        options: ["You finish early or on time", "You work best close to the deadline"],
        traits: ["J", "P"],
        explain: "Simple example:\nBefore an exam or project, some people finish early so their mind feels clear. Others work best when the deadline is close because pressure gives them speed and focus. Choose your real pattern, not the ideal one."
      },
      {
        id: "P1Q6",
        type: "select",
        customInput: true,
        q: "When something is unclear:",
        options: ["You decide quickly and move on", "You explore more before deciding"],
        traits: ["J", "P"],
        explain: "Simple example:\nWhen choosing a restaurant, one person quickly picks a decent place and moves on. Another looks at reviews, menu, distance, and mood before deciding. Choose the style that happens most often with you."
      }
    ]
  });
})();
