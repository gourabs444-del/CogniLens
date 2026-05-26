from engine.mcq_engine import empty_totals


def fuse_dimension_totals(mcq_totals, llm_adjustments=None):
  fused = empty_totals()
  llm_adjustments = llm_adjustments or {}

  for key in fused:
    fused[key] = max(0, int(mcq_totals.get(key, 0) or 0) + int(llm_adjustments.get(key, 0) or 0))

  return fused
