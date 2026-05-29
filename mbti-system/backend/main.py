import asyncio
import json
import sys

from engine.contradiction_engine import analyze_contradictions
from engine.behavior_engine import analyze_behavior_traits
from engine.cognitive_engine import fuse_function_totals
from engine.decision_engine import build_decision
from engine.mcq_engine import score_answers
from llm.llm_engine import analyze_custom_answers, generate_insight
from utils.validator import validate_answers

try:
  from fastapi import FastAPI, HTTPException
  from fastapi.middleware.cors import CORSMiddleware
except ImportError:
  FastAPI = None
  HTTPException = None
  CORSMiddleware = None


if FastAPI:
  app = FastAPI(title="CogniLens MBTI Engine", version="1.0.0")
  app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
  )
else:
  app = None


async def analyze(payload):
  answers = validate_answers(payload)
  llm_result = await analyze_custom_answers(answers)
  scoring = score_answers(
    answers,
    llm_result.get("answerScores"),
    llm_result.get("answerFunctionScores"),
  )
  fused_totals = scoring.get("totals", {})
  function_totals = fuse_function_totals(
    scoring.get("mcqFunctionTotals"),
    scoring.get("apiFunctionTotals"),
  )
  contradiction = analyze_contradictions(answers, scoring, llm_result)
  behavior = analyze_behavior_traits(answers)
  result = build_decision(
    fused_totals,
    contradiction=contradiction,
    phase_totals=scoring.get("phaseTotals"),
    scoring_meta=scoring.get("reaction"),
    function_scores=function_totals,
  )
  result["answersUsed"] = len(answers)
  result["phaseTotals"] = scoring.get("phaseTotals")
  result["phaseFunctionTotals"] = scoring.get("phaseFunctionTotals")
  result["functionMerge"] = {
    "rule": "Function scoring is not configured.",
    "mcqFunctionTotals": scoring.get("mcqFunctionTotals"),
    "apiFunctionTotals": scoring.get("apiFunctionTotals"),
  }
  result["reaction"] = scoring.get("reaction")
  result["contradictions"] = contradiction
  result["contradictionList"] = [item.get("label") for item in contradiction.get("incidents", [])]
  result["contradictionScore"] = contradiction.get("score")
  result["emotionalLogicalConflict"] = contradiction.get("emotionalLogicalConflict")
  result["mask_type"] = result.get("mask", {}).get("selfImageType")
  result["mask_personality"] = result.get("mask", {}).get("selfImageType")
  result["real_personality"] = result.get("mask", {}).get("realPatternType")
  result["shadow_tendencies"] = result.get("shadowTendencies", [])
  result["behavioralTraits"] = behavior
  result["behavioral_tendencies"] = [item.get("label") for item in behavior.get("strongest", [])]
  if behavior.get("strongest"):
    result["tags"] = [
      *result.get("tags", []),
      *[f"{item['label']} {item['value']}%" for item in behavior["strongest"][:2]],
    ]
    result["summary"] = f"{result['summary']} {behavior.get('summary')}"
  result["llm"] = {
    "used": llm_result.get("used", False),
    "analyzedCustomAnswers": len(llm_result.get("analyses", [])),
    "errors": llm_result.get("errors", []),
    "failedAnswerIds": llm_result.get("failedAnswerIds", []),
    "providers": [
      {
        "answerId": item.get("answerId"),
        "provider": item.get("provider"),
        "model": item.get("model"),
        "fallbackErrors": item.get("fallbackErrors", []),
      }
      for item in llm_result.get("analyses", [])
    ],
  }
  result["insight"] = generate_insight(result)
  result["source"] = "backend"
  return result


if app:
  @app.get("/health")
  async def health():
    return {"ok": True, "service": "cognilens-mbti-engine"}


  @app.post("/api/mbti/analyze")
  async def analyze_endpoint(payload: dict):
    try:
      return await analyze(payload)
    except ValueError as error:
      raise HTTPException(status_code=422, detail=str(error)) from error
    except Exception as error:
      raise HTTPException(status_code=500, detail=str(error)) from error


def main():
  payload = json.load(sys.stdin) if not sys.stdin.isatty() else {"answers": []}
  print(json.dumps(asyncio.run(analyze(payload)), indent=2))


if __name__ == "__main__":
  main()
