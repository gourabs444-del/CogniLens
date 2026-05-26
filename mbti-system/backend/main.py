import json
import sys

from engine.decision_engine import build_decision
from engine.fusion_engine import fuse_dimension_totals
from engine.mcq_engine import score_answers
from llm.llm_engine import generate_insight
from utils.validator import validate_answers


def analyze(payload):
  answers = validate_answers(payload)
  mcq_totals = score_answers(answers)
  fused_totals = fuse_dimension_totals(mcq_totals, payload.get("llmAdjustments"))
  result = build_decision(fused_totals)
  result["answersUsed"] = len(answers)
  result["insight"] = generate_insight(result)
  return result


def main():
  payload = json.load(sys.stdin) if not sys.stdin.isatty() else {"answers": []}
  print(json.dumps(analyze(payload), indent=2))


if __name__ == "__main__":
  main()
