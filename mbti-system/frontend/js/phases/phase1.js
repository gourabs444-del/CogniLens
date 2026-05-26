(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P1",
    name: "Phase 1 - Core",
    displayCount: "6 Questions",
    data: [
      {
        type: "select",
        customInput: true,
        q: "When starting a task, you usually:",
        options: ["Make a clear plan first", "Start and adjust as you go"],
        traits: ["J", "P"],
        explain: "Simple meaning:\nThis checks whether you feel safer with structure or whether you learn better by starting. Real-life analogy: before a trip, some people make a route, packing list, and timing plan first. Others start the journey and adjust when they see traffic, weather, or new options."
      },
      {
        type: "select",
        customInput: true,
        q: "When making decisions, you rely more on:",
        options: ["Logic and facts", "Feelings and situation"],
        traits: ["T", "F"],
        explain: "Simple meaning:\nThis checks whether your first filter is objective reasoning or emotional context. Real-life analogy: when buying a phone, a logic-first person compares price, battery, camera, and performance. A feelings-first person also asks whether it feels comfortable, suits their lifestyle, or makes them happy."
      },
      {
        type: "select",
        customInput: true,
        q: "You're more interested in:",
        options: ["Practical things that are directly useful", "Ideas and possibilities"],
        traits: ["S", "N"],
        explain: "Simple meaning:\nThis checks whether your mind first looks for practical use or future possibilities. Real-life analogy: if someone shows you a new gadget, one person asks, 'How will this help me today?' Another asks, 'What could this become in the future?'"
      },
      {
        type: "select",
        customInput: true,
        q: "In your free time, you naturally:",
        options: ["Stay engaged on your own", "Connect with others"],
        traits: ["I", "E"],
        explain: "Simple meaning:\nThis checks how your social battery usually recharges. Real-life analogy: after a busy week, some people recover by gaming, music, coding, or being alone. Others feel alive again after calling friends, chatting, or going out."
      },
      {
        type: "select",
        customInput: true,
        q: "When there's a deadline:",
        options: ["You finish early or on time", "You work best close to the deadline"],
        traits: ["J", "P"],
        explain: "Simple meaning:\nThis checks your natural deadline style. Real-life analogy: before an exam or project, some people finish early so their mind feels clear. Others work best when the deadline is close because pressure gives them speed and focus."
      },
      {
        type: "select",
        customInput: true,
        q: "When something is unclear:",
        options: ["You decide quickly and move on", "You explore more before deciding"],
        traits: ["J", "P"],
        explain: "Simple meaning:\nThis checks whether you prefer quick closure or deeper exploration. Real-life analogy: when choosing a restaurant, one person quickly picks a decent place and moves on. Another checks reviews, menu, distance, and mood before deciding."
      }
    ]
  });
})();
