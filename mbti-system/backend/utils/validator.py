from config.mapping import QUESTION_MAPPING_BY_ID


SUPPORTED_TYPES = {"select", "allocation"}


def validate_answers(payload):
  if not isinstance(payload, dict):
    raise ValueError("Payload must be an object.")

  answers = payload.get("answers", [])
  if not isinstance(answers, list):
    raise ValueError("answers must be a list.")

  validated = []
  for index, answer in enumerate(answers):
    if not isinstance(answer, dict):
      raise ValueError(f"answers[{index}] must be an object.")

    answer_type = answer.get("type")
    if answer_type not in SUPPORTED_TYPES:
      raise ValueError(f"answers[{index}].type must be select or allocation.")

    answer_id = answer.get("id")
    mapping = QUESTION_MAPPING_BY_ID.get(answer_id, {})
    phase = answer.get("phase") or mapping.get("phase")
    traits = answer.get("traits") or mapping.get("traits") or []

    if answer_id and answer_id not in QUESTION_MAPPING_BY_ID:
      raise ValueError(f"answers[{index}].id is not a known question.")
    if not isinstance(traits, list):
      raise ValueError(f"answers[{index}].traits must be a list.")
    if answer_type == "select" and not isinstance(answer.get("selected"), int):
      raise ValueError(f"answers[{index}].selected must be an integer.")
    if answer_type == "allocation" and not isinstance(answer.get("values", []), list):
      raise ValueError(f"answers[{index}].values must be a list.")

    validated.append({
      **answer,
      "id": answer_id,
      "phase": phase,
      "traits": traits,
    })

  return validated
