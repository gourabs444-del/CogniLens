from config.weights import DIMENSIONS, METRIC_KEYS, PAIR_ORDER
from engine.mcq_engine import empty_totals, merge_totals


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
  return {key: round(max(0.0, float((scores or {}).get(key, 0) or 0)), 3) for key in DIMENSIONS}


def pair_winner(scores, left, right, default_left=True):
  clean = normalize_scores(scores)
  if clean[left] == clean[right]:
    return left if default_left else right
  return left if clean[left] > clean[right] else right


def decide_type(scores):
  clean = normalize_scores(scores)
  return "".join([
    pair_winner(clean, "E", "I", default_left=False),
    pair_winner(clean, "S", "N", default_left=False),
    pair_winner(clean, "T", "F", default_left=True),
    pair_winner(clean, "J", "P", default_left=True),
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


def pair_clarity(scores):
  clean = normalize_scores(scores)
  clarity = {}
  for left, right in PAIR_ORDER:
    total = clean[left] + clean[right]
    margin = 0.0 if total <= 0 else abs(clean[left] - clean[right]) / total
    clarity[f"{left}{right}"] = round(margin, 3)
  return clarity


def confidence(scores, contradiction=None, scoring_meta=None):
  clarity_values = list(pair_clarity(scores).values())
  base = 48 + (sum(clarity_values) / max(1, len(clarity_values))) * 48
  contradiction_penalty = float((contradiction or {}).get("score", 0) or 0) * 0.72
  reaction = scoring_meta or {}
  reaction_penalty = (reaction.get("slowCount", 0) * 2.5) + (reaction.get("timeoutCount", 0) * 5.0)
  return round(max(5, min(98, base - contradiction_penalty - reaction_penalty)))


def merge_phases(phase_totals, phases):
  return merge_totals(*[(phase_totals or {}).get(phase, empty_totals()) for phase in phases])


def mask_profile(phase_totals, contradiction=None):
  self_scores = merge_phases(phase_totals, ("P1",))
  real_scores = merge_phases(phase_totals, ("P2", "P3", "P4"))
  self_type = decide_type(self_scores)
  real_type = decide_type(real_scores)
  differences = [
    {"axis": axis, "self": self_type[index], "real": real_type[index]}
    for index, axis in enumerate(("EI", "SN", "TF", "JP"))
    if self_type[index] != real_type[index]
  ]
  contradiction_score = float((contradiction or {}).get("score", 0) or 0)

  return {
    "selfImageType": self_type,
    "realPatternType": real_type,
    "maskLikely": len(differences) >= 2 or contradiction_score >= 22,
    "differences": differences,
  }


def build_summary(type_code, confidence_value, honesty_value, mask):
  mask_line = " Mask-vs-real difference is visible." if mask.get("maskLikely") else " Self-image and behavior are reasonably aligned."
  return (
    f"Your hybrid MBTI signal currently reads as {type_code} with {confidence_value}% confidence "
    f"and {honesty_value}% honesty signal.{mask_line}"
  )


def build_decision(scores, contradiction=None, phase_totals=None, scoring_meta=None):
  type_code = decide_type(scores)
  confidence_value = confidence(scores, contradiction, scoring_meta)
  honesty_value = round(float((contradiction or {}).get("honesty", 100) or 100))
  mask = mask_profile(phase_totals or {}, contradiction)

  return {
    "type": type_code,
    "title": TYPE_TITLES.get(type_code, f"{type_code} Personality Profile"),
    "confidence": confidence_value,
    "honesty": honesty_value,
    "metrics": metrics(scores),
    "totals": normalize_scores(scores),
    "clarity": pair_clarity(scores),
    "mask": mask,
    "summary": build_summary(type_code, confidence_value, honesty_value, mask),
    "tags": [
      "Hybrid engine",
      f"{honesty_value}% honesty",
      "Rapid instinct weighted",
    ],
  }
