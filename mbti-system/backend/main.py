import asyncio
import json
import sys

from engine.contradiction_engine import analyze_contradictions
from engine.decision_engine import build_decision
from engine.fusion_engine import fuse_dimension_totals
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
  scoring = score_answers(answers, llm_result.get("answerScores"))
  fused_totals = fuse_dimension_totals(scoring, llm_result.get("aggregateScores"))
  contradiction = analyze_contradictions(answers, scoring, llm_result)
  result = build_decision(
    fused_totals,
    contradiction=contradiction,
    phase_totals=scoring.get("phaseTotals"),
    scoring_meta=scoring.get("reaction"),
  )
  result["answersUsed"] = len(answers)
  result["phaseTotals"] = scoring.get("phaseTotals")
  result["reaction"] = scoring.get("reaction")
  result["contradictions"] = contradiction
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
