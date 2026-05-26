def validate_answers(payload):
  if not isinstance(payload, dict):
    raise ValueError("Payload must be an object.")

  answers = payload.get("answers", [])
  if not isinstance(answers, list):
    raise ValueError("answers must be a list.")

  for index, answer in enumerate(answers):
    if not isinstance(answer, dict):
      raise ValueError(f"answers[{index}] must be an object.")
    if answer.get("type") not in {"select", "allocation"}:
      raise ValueError(f"answers[{index}].type must be select or allocation.")
    if not isinstance(answer.get("traits", []), list):
      raise ValueError(f"answers[{index}].traits must be a list.")

  return answers
