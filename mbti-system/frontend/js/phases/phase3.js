(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P3",
    name: "Phase 3 - Context Check",
    displayCount: "5 Questions",
    data: [
      {
        type: "select",
        q: "Lambe time tak logon ke sath rehne ke baad tum kya feel karte ho?",
        options: ["Thak jata hu", "Energetic feel karta hu"],
        traits: ["I", "E"]
      },
      {
        type: "select",
        q: "Sach batao: tum zyada kaam kab complete karte ho?",
        options: ["Time se pehle", "Last moment"],
        traits: ["J", "P"]
      },
      {
        type: "select",
        q: "Decision lete waqt tum zyada kispe depend karte ho?",
        options: ["Logic", "Feelings"],
        traits: ["T", "F"]
      },
      {
        type: "select",
        q: "Agar tum ek company start karo, tum kispe zyada focus karoge?",
        options: ["Profit, strategy, logical growth", "Employees, culture, people satisfaction"],
        traits: ["T", "F"]
      },
      {
        type: "select",
        q: "Agar tum ek political party lead karo, tum kispe focus karoge?",
        options: ["Strong decisions, rules, system", "Public emotions, people connect"],
        traits: ["T", "F"]
      }
    ]
  });
})();
