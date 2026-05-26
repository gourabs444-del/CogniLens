(function () {
  window.COGNILENS_PHASES = window.COGNILENS_PHASES || [];
  window.COGNILENS_PHASES.push({
    id: "P2",
    name: "Phase 2 - Preferences",
    displayCount: "5 Questions",
    data: [
      {
        type: "select",
        q: "What do you usually prefer to watch?",
        options: ["Crime, strategy, mind games", "Love, emotions, relationships", "Real-life / realistic stories"],
        traits: ["T", "F", "S"],
        explain: "Simple meaning:\nThis checks what naturally holds your attention. Real-life analogy: when you open a streaming app, your first choice can show your mental flavor. Strategy and mind games point toward analysis, emotional stories point toward people and feelings, and realistic stories point toward practical real-world interest."
      },
      {
        type: "select",
        q: "What do you usually do when you get free time?",
        options: ["Do something on your own (gaming, music, coding, etc.)", "Talk to someone or socialize"],
        traits: ["I", "E"],
        explain: "Simple meaning:\nThis checks where your energy naturally goes when nobody is forcing you. Real-life analogy: after school or work, some people instantly wear headphones, open a game, learn something, or create alone. Others feel better by messaging, calling, or meeting people."
      },
      {
        type: "select",
        q: "What kind of topics feel more interesting to you?",
        options: ["Future, ideas, possibilities", "Real life, practical things"],
        traits: ["N", "S"],
        explain: "Simple meaning:\nThis checks whether your mind enjoys imagination and patterns or practical reality. Real-life analogy: in a conversation, one person enjoys discussing future technology, theories, and what could happen. Another enjoys useful tips, real examples, and what can be done right now."
      },
      {
        type: "select",
        q: "What type of content feels boring to you?",
        options: ["Slow emotional stories", "Simple real-life / daily stuff"],
        traits: ["T", "N"],
        explain: "Simple meaning:\nThis is a reverse signal. It checks what your mind naturally rejects when content feels too slow or too ordinary. Real-life analogy: some people get bored when a movie spends too much time on feelings. Others get bored when the story is too normal and want bigger ideas, twists, or imagination."
      },
      {
        type: "select",
        q: "What do you prefer more?",
        options: ["Solo activities (gaming, editing, learning)", "Group activities (friends, chatting)"],
        traits: ["I", "E"],
        explain: "Simple meaning:\nThis checks whether your natural comfort zone is solo focus or group energy. Real-life analogy: on a free evening, one person feels happiest improving a skill, editing, gaming, or learning alone. Another feels happiest when friends are involved and the moment becomes social."
      }
    ]
  });
})();
