from config.weights import COGNITIVE_FUNCTIONS


def empty_function_totals():
  return {function: 0.0 for function in COGNITIVE_FUNCTIONS}


def merge_function_totals(*score_sets):
  merged = empty_function_totals()
  for scores in score_sets:
    for key, value in (scores or {}).items():
      if key in merged:
        merged[key] += float(value or 0)
  return merged


def fuse_function_totals(*_args, **_kwargs):
  return empty_function_totals()


def function_distribution(*_args, **_kwargs):
  return {}


def score_functions(*_args, **_kwargs):
  return empty_function_totals()


def normalize_function_scores(scores=None):
  return {function: 0 for function in COGNITIVE_FUNCTIONS}


def type_equation_scores(*_args, **_kwargs):
  return {}


def type_stack_score(*_args, **_kwargs):
  return 0


def best_function_type(*_args, **_kwargs):
  return ("UNCL", 0)


def shadow_tendencies(*_args, **_kwargs):
  return []
