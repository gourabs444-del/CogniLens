import json

from engine.cognitive_engine import empty_function_totals
from engine.mcq_engine import empty_totals
from llm.prompt import build_result_prompt
from llm.router import route_for_result


def clamp_trait_json(data=None):
  return empty_totals()


def clamp_function_json(data=None):
  return empty_function_totals()


def unpack_analysis_json(data=None):
  return {
    "traits": empty_totals(),
    "functions": empty_function_totals(),
    "behavior": {},
  }


def extract_json(text):
  if not text:
    return {}
  return json.loads(text)


async def analyze_custom_answers(answers):
  return {
    "analyses": [],
    "aggregateScores": empty_totals(),
    "aggregateFunctionScores": empty_function_totals(),
    "answerScores": {},
    "answerFunctionScores": {},
    "errors": [],
    "failedAnswerIds": [],
    "used": False,
  }


def generate_insight(result):
  return {
    "route": route_for_result(result),
    "prompt": build_result_prompt(result),
    "summary": result.get("summary") or "MBTI scoring algorithm is not configured.",
  }
