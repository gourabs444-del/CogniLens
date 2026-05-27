import json
import re

from config.weights import DIMENSIONS
from config.mapping import QUESTION_MAPPING_BY_ID
from engine.mcq_engine import empty_totals, merge_totals
from llm.prompt import build_result_prompt, build_trait_prompt
from llm.router import provider_configs, route_for_result


def clamp_trait_json(data):
  scores = empty_totals()
  if not isinstance(data, dict):
    return scores

  for key in DIMENSIONS:
    try:
      scores[key] = max(0.0, min(10.0, float(data.get(key, 0) or 0)))
    except (TypeError, ValueError):
      scores[key] = 0.0

  return scores


def extract_json(text):
  if not text:
    return {}

  cleaned = text.strip()
  if cleaned.startswith("```"):
    cleaned = re.sub(r"^```(?:json)?", "", cleaned, flags=re.IGNORECASE).strip()
    cleaned = re.sub(r"```$", "", cleaned).strip()

  try:
    return json.loads(cleaned)
  except json.JSONDecodeError:
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if not match:
      raise
    return json.loads(match.group(0))


async def post_openai_compatible(client, provider, prompt):
  headers = {
    "Authorization": f"Bearer {provider['api_key']}",
    "Content-Type": "application/json",
    **provider.get("headers", {}),
  }
  payload = {
    "model": provider["model"],
    "temperature": 0.1,
    "response_format": {"type": "json_object"},
    "messages": [
      {
        "role": "system",
        "content": "Return JSON only. Never return an MBTI type. Only score trait letters.",
      },
      {"role": "user", "content": prompt},
    ],
  }
  response = await client.post(provider["base_url"], headers=headers, json=payload)
  response.raise_for_status()
  data = response.json()
  return data["choices"][0]["message"]["content"]


async def post_gemini(client, provider, prompt):
  url = f"{provider['base_url'].rstrip('/')}/{provider['model']}:generateContent?key={provider['api_key']}"
  payload = {
    "contents": [{"role": "user", "parts": [{"text": prompt}]}],
    "generationConfig": {
      "temperature": 0.1,
      "responseMimeType": "application/json",
    },
  }
  response = await client.post(url, json=payload)
  response.raise_for_status()
  data = response.json()
  return data["candidates"][0]["content"]["parts"][0]["text"]


async def call_with_fallback(prompt):
  try:
    import httpx
  except ImportError as error:
    raise RuntimeError("httpx is not installed. Install backend requirements first.") from error

  errors = []
  configs = provider_configs()
  if not configs:
    raise RuntimeError("No LLM provider keys configured.")

  async with httpx.AsyncClient(timeout=18) as client:
    for provider in configs:
      try:
        if provider["kind"] == "gemini":
          content = await post_gemini(client, provider, prompt)
        else:
          content = await post_openai_compatible(client, provider, prompt)
        return {
          "provider": provider["name"],
          "model": provider["model"],
          "content": content,
          "errors": errors,
        }
      except Exception as error:
        errors.append({
          "provider": provider["name"],
          "error": str(error)[:240],
        })

  raise RuntimeError(f"All LLM providers failed: {errors}")


def custom_answers(answers):
  selected_custom = []
  for index, answer in enumerate(answers):
    text = (answer.get("customAnswer") or "").strip()
    mapping = QUESTION_MAPPING_BY_ID.get(answer.get("id"), {})
    option_count = len(mapping.get("options") or answer.get("traits") or [])
    selected = answer.get("selected")
    if text and isinstance(selected, int) and selected >= option_count:
      selected_custom.append({**answer, "_index": index})
  return selected_custom


async def analyze_custom_answers(answers):
  analyses = []
  aggregate_scores = empty_totals()
  errors = []
  failed_ids = []

  for answer in custom_answers(answers):
    try:
      routed = await call_with_fallback(build_trait_prompt(answer))
      scores = clamp_trait_json(extract_json(routed["content"]))
      aggregate_scores = merge_totals(aggregate_scores, scores)
      analyses.append({
        "answerId": answer.get("id"),
        "index": answer.get("_index"),
        "scores": scores,
        "provider": routed["provider"],
        "model": routed["model"],
        "fallbackErrors": routed.get("errors", []),
      })
    except Exception as error:
      failed_ids.append(answer.get("id") or str(answer.get("_index")))
      errors.append({
        "answerId": answer.get("id"),
        "error": str(error)[:240],
      })

  return {
    "analyses": analyses,
    "aggregateScores": aggregate_scores,
    "answerScores": {
      item["answerId"] or str(item["index"]): item["scores"]
      for item in analyses
    },
    "errors": errors,
    "failedAnswerIds": failed_ids,
    "used": bool(analyses),
  }


def generate_insight(result):
  route = route_for_result(result)
  prompt = build_result_prompt(result)
  return {
    "route": route,
    "prompt": prompt,
    "summary": result.get("summary") or f"{result.get('type')} profile generated with {result.get('confidence')}% confidence.",
  }
