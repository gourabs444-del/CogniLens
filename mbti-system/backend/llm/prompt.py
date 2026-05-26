def build_result_prompt(result):
  return (
    "Summarize this MBTI result in a concise, non-clinical way. "
    f"Type: {result.get('type')}. Metrics: {result.get('metrics')}."
  )
