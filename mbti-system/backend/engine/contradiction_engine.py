from config.mapping import QUESTION_MAPPING_BY_ID


def selected_trait(answer):
  selected = answer.get("selected")
  mapping = QUESTION_MAPPING_BY_ID.get(answer.get("id"), {})
  options = mapping.get("options") or []

  if isinstance(selected, int) and 0 <= selected < len(options):
    scores = options[selected]
    if scores:
      return max(scores.items(), key=lambda item: item[1])[0]

  traits = answer.get("traits") or mapping.get("traits") or []
  if isinstance(selected, int) and 0 <= selected < len(traits):
    return traits[selected]

  return None


def answer_map(answers):
  return {answer.get("id"): answer for answer in answers if answer.get("id")}


def majority_trait(ids, answers_by_id, allowed):
  counts = {trait: 0 for trait in allowed}
  for question_id in ids:
    trait = selected_trait(answers_by_id.get(question_id, {}))
    if trait in counts:
      counts[trait] += 1
  if not any(counts.values()):
    return None
  return max(counts.items(), key=lambda item: item[1])[0]


def add_incident(incidents, score, code, label, evidence):
  incidents.append({
    "code": code,
    "label": label,
    "penalty": score,
    "evidence": evidence,
  })


def analyze_contradictions(answers, scoring_result=None, llm_result=None):
  answers_by_id = answer_map(answers)
  incidents = []

  direct_pairs = [
    ("P1Q2", "P3Q3", ("T", "F"), 9, "Decision self-image changed in direct context"),
    ("P1Q5", "P3Q2", ("J", "P"), 8, "Deadline self-image differs from actual behavior"),
    ("P1Q4", "P3Q1", ("I", "E"), 7, "Social identity differs from recovery pattern"),
  ]

  for left_id, right_id, allowed, penalty, label in direct_pairs:
    left = selected_trait(answers_by_id.get(left_id, {}))
    right = selected_trait(answers_by_id.get(right_id, {}))
    if left in allowed and right in allowed and left != right:
      add_incident(incidents, penalty, f"{left_id}_{right_id}", label, [left_id, right_id])

  self_decision = selected_trait(answers_by_id.get("P1Q2", {}))
  behavioral_decision = majority_trait(("P3Q4", "P3Q5"), answers_by_id, ("T", "F"))
  instinct_decision = majority_trait(("P4Q1", "P4Q2", "P4Q4"), answers_by_id, ("T", "F"))

  if self_decision == "T" and behavioral_decision == "F":
    add_incident(
      incidents,
      12,
      "logic_claim_people_context",
      "Logic-first claim conflicts with people-first leadership choices",
      ["P1Q2", "P3Q4", "P3Q5"],
    )

  if self_decision in ("T", "F") and instinct_decision in ("T", "F") and self_decision != instinct_decision:
    add_incident(
      incidents,
      13,
      "self_decision_instinct_split",
      "Self-described decision style conflicts with rapid instinct choices",
      ["P1Q2", "P4Q1", "P4Q2", "P4Q4"],
    )

  self_structure = majority_trait(("P1Q1", "P1Q5", "P1Q6"), answers_by_id, ("J", "P"))
  instinct_structure = selected_trait(answers_by_id.get("P4Q3", {}))
  if self_structure in ("J", "P") and instinct_structure in ("J", "P") and self_structure != instinct_structure:
    add_incident(
      incidents,
      10,
      "structure_instinct_split",
      "Planned self-image differs from plan-vs-flow instinct",
      ["P1Q1", "P1Q5", "P1Q6", "P4Q3"],
    )

  natural_energy = majority_trait(("P2Q2", "P2Q5", "P3Q1", "P4Q5"), answers_by_id, ("I", "E"))
  self_energy = selected_trait(answers_by_id.get("P1Q4", {}))
  if self_energy in ("I", "E") and natural_energy in ("I", "E") and self_energy != natural_energy:
    add_incident(
      incidents,
      9,
      "energy_mask_split",
      "Self-described energy differs from hidden and instinct energy pattern",
      ["P1Q4", "P2Q2", "P2Q5", "P3Q1", "P4Q5"],
    )

  reaction = (scoring_result or {}).get("reaction", {})
  slow_penalty = min(14, int(reaction.get("slowCount", 0) or 0) * 3)
  timeout_penalty = min(16, int(reaction.get("timeoutCount", 0) or 0) * 5)
  custom_failures = len((llm_result or {}).get("failedAnswerIds", []))
  custom_penalty = min(12, custom_failures * 4)

  contradiction_score = min(55, sum(item["penalty"] for item in incidents))
  total_penalty = min(65, contradiction_score + slow_penalty + timeout_penalty + custom_penalty)
  honesty = max(30, round(100 - total_penalty))

  return {
    "score": contradiction_score,
    "honesty": honesty,
    "incidents": incidents,
    "reactionPenalty": slow_penalty + timeout_penalty,
    "customTextPenalty": custom_penalty,
    "maskSignals": {
      "selfDecision": self_decision,
      "behavioralDecision": behavioral_decision,
      "instinctDecision": instinct_decision,
      "selfStructure": self_structure,
      "instinctStructure": instinct_structure,
      "selfEnergy": self_energy,
      "naturalEnergy": natural_energy,
    },
  }
