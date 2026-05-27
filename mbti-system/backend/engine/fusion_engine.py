from engine.mcq_engine import empty_totals, merge_totals


def scaled_llm_adjustment(llm_adjustments=None, max_points=6.0):
  clean = empty_totals()
  llm_adjustments = llm_adjustments or {}
  total = 0.0

  for key in clean:
    value = max(0.0, float(llm_adjustments.get(key, 0) or 0))
    clean[key] = value
    total += value

  if total <= 0:
    return empty_totals()

  return {key: (value / total) * max_points for key, value in clean.items()}


def fuse_dimension_totals(scoring_result, llm_adjustments=None):
  mcq_totals = scoring_result.get("totals", scoring_result) if isinstance(scoring_result, dict) else {}
  return merge_totals(mcq_totals, scaled_llm_adjustment(llm_adjustments))
