from config.weights import COGNITIVE_FUNCTIONS, DIMENSIONS, PHASE_WEIGHTS


def empty_totals():
  return {dimension: 0.0 for dimension in DIMENSIONS}


def merge_totals(*score_sets):
  merged = empty_totals()
  for scores in score_sets:
    for key, value in (scores or {}).items():
      if key in merged:
        merged[key] += float(value or 0)
  return merged


def empty_function_totals():
  return {function: 0.0 for function in COGNITIVE_FUNCTIONS}


def score_answers(answers, llm_answer_scores=None, llm_function_scores=None):
  return {
    "totals": empty_totals(),
    "functionTotals": empty_function_totals(),
    "mcqFunctionTotals": empty_function_totals(),
    "apiFunctionTotals": empty_function_totals(),
    "phaseTotals": {phase: empty_totals() for phase in PHASE_WEIGHTS},
    "phaseFunctionTotals": {phase: empty_function_totals() for phase in PHASE_WEIGHTS},
    "answerScores": [],
    "reaction": {
      "averageMs": None,
      "slowCount": 0,
      "timeoutCount": 0,
      "trackedCount": 0,
    },
  }
