from config.weights import DIMENSIONS


TRAIT_JSON_EXAMPLE = """{
  "I": 6,
  "E": 4,
  "N": 8,
  "S": 2,
  "T": 7,
  "F": 3,
  "J": 5,
  "P": 5
}"""


def build_trait_prompt(answer):
  return f"""
You are analyzing one custom answer from a personality assessment.

Rules:
- Do not return an MBTI type.
- Do not diagnose the user.
- Return only valid JSON.
- Score only the eight trait letters: {", ".join(DIMENSIONS)}.
- Each score must be an integer from 0 to 10.
- Opposite pairs should usually sum near 10: I/E, N/S, T/F, J/P.
- If the text is unclear, keep pairs near 5/5.

Question:
{answer.get("question", "")}

Selected custom answer:
{answer.get("customAnswer", "")}

Expected JSON shape:
{TRAIT_JSON_EXAMPLE}
""".strip()


def build_result_prompt(result):
  return (
    "Summarize this non-clinical MBTI-style result briefly. "
    f"Type: {result.get('type')}. Confidence: {result.get('confidence')}. "
    f"Honesty: {result.get('honesty')}. Metrics: {result.get('metrics')}."
  )
