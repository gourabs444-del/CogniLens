from config.weights import DIMENSIONS, SELECT_POINTS


def empty_totals():
  return {dimension: 0 for dimension in DIMENSIONS}


def score_select_answer(answer):
  totals = empty_totals()
  traits = answer.get("traits", [])
  selected = answer.get("selected")
  if isinstance(selected, int) and 0 <= selected < len(traits):
    trait = traits[selected]
    if trait in totals:
      totals[trait] += SELECT_POINTS
  return totals


def score_allocation_answer(answer):
  totals = empty_totals()
  traits = answer.get("traits", [])
  values = answer.get("values", [])
  for index, value in enumerate(values):
    if index >= len(traits):
      continue
    trait = traits[index]
    if trait in totals:
      totals[trait] += max(0, int(value or 0))
  return totals


def merge_totals(*score_sets):
  merged = empty_totals()
  for scores in score_sets:
    for key, value in scores.items():
      if key in merged:
        merged[key] += value
  return merged


def score_answers(answers):
  scored = []
  for answer in answers:
    if answer.get("type") == "allocation":
      scored.append(score_allocation_answer(answer))
    else:
      scored.append(score_select_answer(answer))
  return merge_totals(*scored)
