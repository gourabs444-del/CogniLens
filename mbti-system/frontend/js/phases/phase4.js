(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P4",
    name: "Phase 4 - Pressure",
    displayCount: "4 Questions",
    data: [
      {
        type: "select",
        q: "Sach bolne se agar relation toot jaye, kya tum sach bologe?",
        options: ["Haan", "Na"],
        traits: ["T", "F"]
      },
      {
        type: "select",
        q: "Tum zyada kya choose karoge?",
        options: ["Future control karna", "Present enjoy karna"],
        traits: ["J", "P"]
      },
      {
        type: "select",
        q: "Problem aane par tum kya karte ho?",
        options: ["Face karna", "Avoid karna"],
        traits: ["E", "I"]
      },
      {
        type: "select",
        q: "Tum zyada kya choose karoge?",
        options: ["Safe rehna", "Risk lena"],
        traits: ["J", "P"]
      }
    ]
  });
})();
