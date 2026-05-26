from llm.prompt import build_result_prompt
from llm.router import route_for_result


def generate_insight(result):
  route = route_for_result(result)
  prompt = build_result_prompt(result)
  return {
    "route": route,
    "prompt": prompt,
    "summary": f"{result.get('type')} profile generated with {result.get('confidence')}% confidence.",
  }
