(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P2",
    name: "Phase 2 - Preferences",
    displayCount: "5 Questions",
    data: [
      {
        id: "P2Q1",
        type: "select",
        q: "What do you usually prefer to watch?",
        options: ["Crime, strategy, mind games", "Love, emotions, relationships", "Real-life / realistic stories"],
        traits: ["T", "F", "S"],
        explain: "Simple example:\nWhen you open a streaming app, notice what you click without thinking too much. Some people enjoy strategy and mind games, some enjoy emotional stories, and some prefer realistic stories. Choose what you usually pick on your own."
      },
      {
        id: "P2Q2",
        type: "select",
        q: "What do you usually do when you get free time?",
        options: ["Do something on your own (gaming, music, coding, etc.)", "Talk to someone or socialize"],
        traits: ["I", "E"],
        explain: "Simple example:\nAfter school or work, some people instantly wear headphones, open a game, learn something, or create alone. Others feel better by messaging, calling, or meeting people. Choose your natural free-time habit."
      },
      {
        id: "P2Q3",
        type: "select",
        q: "What kind of topics feel more interesting to you?",
        options: ["Future, ideas, possibilities", "Real life, practical things"],
        traits: ["N", "S"],
        explain: "Simple example:\nIn a conversation, one person enjoys future technology, theories, and what could happen. Another enjoys useful tips, real examples, and what can be done right now. Choose the topic style that pulls your attention more."
      },
      {
        id: "P2Q4",
        type: "select",
        q: "What type of content feels boring to you?",
        options: ["Slow emotional stories", "Simple real-life / daily stuff"],
        traits: ["T", "N"],
        explain: "Simple example:\nSome people get bored when a movie spends too much time on feelings. Others get bored when the story feels too normal and want bigger ideas, twists, or imagination. Choose the one that usually makes you lose interest faster."
      },
      {
        id: "P2Q5",
        type: "select",
        q: "What do you prefer more?",
        options: ["Solo activities (gaming, editing, learning)", "Group activities (friends, chatting)"],
        traits: ["I", "E"],
        explain: "Simple example:\nOn a free evening, one person feels happiest improving a skill, editing, gaming, or learning alone. Another feels happiest when friends are involved and the moment becomes social. Choose what you would actually prefer."
      }
    ]
  });
})();
