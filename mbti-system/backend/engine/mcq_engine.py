from copy import deepcopy

from config.mapping import QUESTION_MAPPING_BY_ID
from config.weights import ALLOCATION_TOTAL, DIMENSIONS, PHASE_WEIGHTS, REACTION_THRESHOLDS_MS


def empty_totals():
  return {dimension: 0.0 for dimension in DIMENSIONS}


def merge_totals(*score_sets):
  merged = empty_totals()
  for scores in score_sets:
    for key, value in (scores or {}).items():
      if key in merged:
        merged[key] += float(value or 0)
  return merged


def clamp_trait_scores(scores):
  clean = empty_totals()
  for key, value in (scores or {}).items():
    if key in clean:
      clean[key] = max(0.0, float(value or 0))
  return clean


def phase_counts(answers):
  counts = {}
  for answer in answers:
    phase = answer.get("phase") or QUESTION_MAPPING_BY_ID.get(answer.get("id"), {}).get("phase")
    if phase in PHASE_WEIGHTS:
      counts[phase] = counts.get(phase, 0) + 1
  return counts


def reaction_multiplier(answer):
  if answer.get("timedOut"):
    return 0.58

  ms = answer.get("reactionTimeMs")
  if not isinstance(ms, (int, float)) or ms <= 0:
    return 1.0

  time_limit = answer.get("timeLimitMs")
  if isinstance(time_limit, (int, float)) and time_limit > 0:
    ratio = ms / time_limit
    if ratio <= 0.45:
      return 1.16
    if ratio <= 0.85:
      return 1.08
    if ratio <= 1.05:
      return 0.96
    return 0.72

  thresholds = REACTION_THRESHOLDS_MS
  if ms <= thresholds["very_fast"]:
    return 1.12
  if ms <= thresholds["fast"]:
    return 1.06
  if ms <= thresholds["steady"]:
    return 1.0
  if ms <= thresholds["slow"]:
    return 0.88
  return 0.74


def score_from_trait_distribution(distribution, question_weight, multiplier):
  totals = empty_totals()
  clean = clamp_trait_scores(distribution)
  total_signal = sum(clean.values())
  if total_signal <= 0:
    return totals

  for trait, value in clean.items():
    totals[trait] += question_weight * multiplier * (value / total_signal)
  return totals


def option_distribution(answer):
  selected = answer.get("selected")
  mapping = QUESTION_MAPPING_BY_ID.get(answer.get("id"), {})
  options = mapping.get("options") or []

  if isinstance(selected, int) and 0 <= selected < len(options):
    return options[selected]

  traits = answer.get("traits") or mapping.get("traits") or []
  if isinstance(selected, int) and 0 <= selected < len(traits):
    return {traits[selected]: 1.0}

  return None


def custom_distribution(answer, llm_answer_scores):
  answer_id = answer.get("id")
  selected = answer.get("selected")
  selected_is_custom = isinstance(selected, int) and selected >= len(answer.get("traits") or [])
  has_custom_text = bool((answer.get("customAnswer") or "").strip())

  if not selected_is_custom and not has_custom_text:
    return None

  return llm_answer_scores.get(answer_id) or llm_answer_scores.get(str(answer.get("questionIndex")))


def score_select_answer(answer, question_weight, llm_answer_scores):
  distribution = option_distribution(answer)
  if distribution is None:
    distribution = custom_distribution(answer, llm_answer_scores)
  if distribution is None:
    return empty_totals()
  return score_from_trait_distribution(distribution, question_weight, reaction_multiplier(answer))


def score_allocation_answer(answer, question_weight):
  totals = empty_totals()
  traits = answer.get("traits", [])
  values = answer.get("values", [])
  multiplier = reaction_multiplier(answer)

  for index, value in enumerate(values):
    if index >= len(traits):
      continue
    trait = traits[index]
    if trait in totals:
      safe_value = max(0.0, min(float(value or 0), float(ALLOCATION_TOTAL)))
      totals[trait] += question_weight * multiplier * (safe_value / ALLOCATION_TOTAL)

  return totals


def score_answers(answers, llm_answer_scores=None):
  llm_answer_scores = llm_answer_scores or {}
  counts = phase_counts(answers)
  totals = empty_totals()
  phase_totals = {phase: empty_totals() for phase in PHASE_WEIGHTS}
  answer_scores = []
  reaction_times = []
  slow_count = 0
  timeout_count = 0

  for index, answer in enumerate(answers):
    mapping = QUESTION_MAPPING_BY_ID.get(answer.get("id"), {})
    phase = answer.get("phase") or mapping.get("phase")
    if phase not in PHASE_WEIGHTS:
      continue

    question_weight = PHASE_WEIGHTS[phase] / max(1, counts.get(phase, 1))
    if answer.get("type") == "allocation":
      scored = score_allocation_answer(answer, question_weight)
    else:
      scored = score_select_answer(answer, question_weight, llm_answer_scores)

    totals = merge_totals(totals, scored)
    phase_totals[phase] = merge_totals(phase_totals[phase], scored)

    ms = answer.get("reactionTimeMs")
    if isinstance(ms, (int, float)) and ms > 0:
      reaction_times.append(ms)
      if ms > REACTION_THRESHOLDS_MS["slow"]:
        slow_count += 1
    if answer.get("timedOut"):
      timeout_count += 1

    answer_scores.append({
      "index": index,
      "id": answer.get("id"),
      "phase": phase,
      "scores": deepcopy(scored),
      "reactionMultiplier": round(reaction_multiplier(answer), 3),
    })

  average_ms = round(sum(reaction_times) / len(reaction_times)) if reaction_times else None
  return {
    "totals": totals,
    "phaseTotals": phase_totals,
    "answerScores": answer_scores,
    "reaction": {
      "averageMs": average_ms,
      "slowCount": slow_count,
      "timeoutCount": timeout_count,
      "trackedCount": len(reaction_times),
    },
  }
