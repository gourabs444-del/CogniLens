BEHAVIOR_META = {}


NON_INFORMATIVE_TEXT = {
  "",
  "none",
  "no",
  "nope",
  "na",
  "n/a",
  "nil",
  "nothing",
  "idk",
  "dont know",
  "don't know",
  "kuch nahi",
  "pata nahi",
}


def is_non_informative_text(value):
  text = " ".join(str(value or "").strip().lower().replace(".", " ").split())
  return text in NON_INFORMATIVE_TEXT or len(text) <= 1


def selected_behavior(answer):
  return None


def analyze_behavior_traits(answers):
  return {
    "scores": {},
    "meta": BEHAVIOR_META,
    "evidenceQuestionIds": [],
    "coverage": 0,
    "summary": "Behavior scoring algorithm is not configured.",
    "strongest": [],
  }


def build_behavior_summary(scores=None):
  return "Behavior scoring algorithm is not configured."
