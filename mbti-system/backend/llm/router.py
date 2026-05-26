def route_for_result(result):
  confidence = int(result.get("confidence", 0) or 0)
  return "detailed" if confidence >= 70 else "balanced"
