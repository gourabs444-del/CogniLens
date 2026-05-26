from config.weights import DIMENSIONS


TYPE_TITLES = {
  "ISTJ": "Practical Systems Guardian",
  "ISFJ": "Supportive Detail Keeper",
  "INFJ": "Insightful Purpose Builder",
  "INTJ": "Strategic Systems Thinker",
  "ISTP": "Precise Tactical Solver",
  "ISFP": "Grounded Creative Observer",
  "INFP": "Reflective Values Explorer",
  "INTP": "Analytical Pattern Architect",
  "ESTP": "Action-Oriented Problem Mover",
  "ESFP": "Expressive Experience Driver",
  "ENFP": "Possibility-Focused Connector",
  "ENTP": "Inventive Challenge Solver",
  "ESTJ": "Structured Execution Leader",
  "ESFJ": "Collaborative Support Organizer",
  "ENFJ": "People-Centered Vision Guide",
  "ENTJ": "Decisive Strategy Builder",
}


def normalize_scores(scores):
  return {key: max(0, int(scores.get(key, 0) or 0)) for key in DIMENSIONS}


def decide_type(scores):
  clean = normalize_scores(scores)
  return "".join([
    "E" if clean["E"] > clean["I"] else "I",
    "S" if clean["S"] > clean["N"] else "N",
    "T" if clean["T"] > clean["F"] else "F",
    "J" if clean["J"] > clean["P"] else "P",
  ])


def metrics(scores):
  clean = normalize_scores(scores)

  def percentage(left, right):
    total = clean[left] + clean[right]
    return 50 if total == 0 else round((clean[left] / total) * 100)

  return {
    "I": percentage("I", "E"),
    "N": percentage("N", "S"),
    "T": percentage("T", "F"),
    "J": percentage("J", "P"),
  }


def confidence(scores):
  clean = normalize_scores(scores)
  total_diff = (
    abs(clean["E"] - clean["I"])
    + abs(clean["S"] - clean["N"])
    + abs(clean["T"] - clean["F"])
    + abs(clean["J"] - clean["P"])
  )
  return min(95, round(total_diff * 2))


def build_decision(scores):
  type_code = decide_type(scores)
  return {
    "type": type_code,
    "title": TYPE_TITLES.get(type_code, f"{type_code} Personality Profile"),
    "confidence": confidence(scores),
    "metrics": metrics(scores),
    "totals": normalize_scores(scores),
  }
