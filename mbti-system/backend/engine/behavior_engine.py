from config.mapping import QUESTION_MAPPING_BY_ID


BEHAVIOR_META = {
  "loyalty": {"label": "Loyalty", "kind": "strength"},
  "betrayalSensitivity": {"label": "Betrayal sensitivity", "kind": "sensitivity"},
  "envy": {"label": "Envy pressure", "kind": "risk"},
  "slothRisk": {"label": "Sloth risk", "kind": "risk"},
  "drive": {"label": "Drive", "kind": "strength"},
  "impulseControl": {"label": "Impulse control", "kind": "strength"},
  "lustImpulse": {"label": "Attraction impulse", "kind": "risk"},
  "forgiveness": {"label": "Repair instinct", "kind": "strength"},
}


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
  if is_non_informative_text(answer.get("customAnswer")) and isinstance(answer.get("selected"), int):
    mapping = QUESTION_MAPPING_BY_ID.get(answer.get("id"), {})
    if answer["selected"] >= len(mapping.get("options") or answer.get("traits") or []):
      return None

  selected = answer.get("selected")
  mapping = QUESTION_MAPPING_BY_ID.get(answer.get("id"), {})
  options = mapping.get("behaviorOptions") or []
  if isinstance(selected, int) and 0 <= selected < len(options):
    return options[selected]
  return None


def analyze_behavior_traits(answers):
  totals = {key: 0.0 for key in BEHAVIOR_META}
  counts = {key: 0 for key in BEHAVIOR_META}
  evidence = []

  for answer in answers:
    behavior = selected_behavior(answer)
    if not behavior:
      continue

    for key, value in behavior.items():
      if key not in totals:
        continue
      totals[key] += max(0.0, min(10.0, float(value or 0)))
      counts[key] += 1

    evidence.append(answer.get("id"))

  scores = {}
  for key in BEHAVIOR_META:
    if counts[key] == 0:
      scores[key] = None
    else:
      scores[key] = round((totals[key] / counts[key]) * 10)

  available = {key: value for key, value in scores.items() if value is not None}
  strongest = sorted(available.items(), key=lambda item: item[1], reverse=True)[:3]

  return {
    "scores": scores,
    "meta": BEHAVIOR_META,
    "evidenceQuestionIds": evidence,
    "coverage": len(set(evidence)),
    "summary": build_behavior_summary(scores),
    "strongest": [
      {"key": key, "label": BEHAVIOR_META[key]["label"], "value": value}
      for key, value in strongest
    ],
  }


def value_or_unknown(scores, key):
  value = scores.get(key)
  return None if value is None else int(value)


def build_behavior_summary(scores):
  if not any(value is not None for value in scores.values()):
    return "Not enough usable behavioral answers were found."

  loyalty = value_or_unknown(scores, "loyalty")
  drive = value_or_unknown(scores, "drive")
  impulse = value_or_unknown(scores, "impulseControl")
  envy = value_or_unknown(scores, "envy")

  parts = []
  if loyalty is not None:
    parts.append(f"loyalty signal {loyalty}%")
  if drive is not None:
    parts.append(f"drive signal {drive}%")
  if impulse is not None:
    parts.append(f"impulse control {impulse}%")
  if envy is not None:
    parts.append(f"envy pressure {envy}%")

  return "Behavior layer: " + ", ".join(parts) + "."
