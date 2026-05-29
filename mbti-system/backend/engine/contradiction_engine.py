def selected_trait(answer):
  return None


def answer_map(answers):
  return {}


def majority_trait(ids, answers_by_id, allowed):
  return None


def analyze_contradictions(answers, scoring_result=None, llm_result=None):
  return {
    "score": 0,
    "honesty": 100,
    "incidents": [],
    "reactionPenalty": 0,
    "customTextPenalty": 0,
    "maskSignals": {},
    "emotionalLogicalConflict": {
      "selfLogic": 0,
      "selfEmotion": 0,
      "behaviorLogic": 0,
      "behaviorEmotion": 0,
      "selfStyle": "unconfigured",
      "behaviorStyle": "unconfigured",
      "conflictDetected": False,
    },
  }
