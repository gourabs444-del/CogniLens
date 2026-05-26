(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P2",
    name: "Phase 2 - Preferences",
    displayCount: "5 Questions",
    data: [
      {
        type: "select",
        q: "Tum generally kya dekhna pasand karte ho?",
        options: ["Crime, strategy, mind games", "Love, emotions, relationships", "Real-life / realistic stories"],
        traits: ["T", "F", "S"]
      },
      {
        type: "select",
        q: "Free time milte hi tum kya karte ho?",
        options: ["Apne aap kuch karta hu (game, music, coding, etc.)", "Kisi se baat karta hu ya social hota hu"],
        traits: ["I", "E"]
      },
      {
        type: "select",
        q: "Tumhe zyada kis type ki baatein interesting lagti hain?",
        options: ["Future, ideas, possibilities", "Real life, practical cheezein"],
        traits: ["N", "S"]
      },
      {
        type: "select",
        q: "Tumhe kaunsa type ka content boring lagta hai?",
        options: ["Slow emotional stories", "Simple real-life / daily stuff"],
        traits: ["T", "N"]
      },
      {
        type: "select",
        q: "Tumhe zyada kya pasand hai?",
        options: ["Solo activities (gaming, editing, learning)", "Group activities (friends, chatting)"],
        traits: ["I", "E"]
      }
    ]
  });
})();
