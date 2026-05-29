from config.weights import COGNITIVE_FUNCTIONS, DIMENSIONS, METRIC_KEYS, PAIR_ORDER
from engine.cognitive_engine import normalize_function_scores


TYPE_TITLES = {
  "UNCL": "Scoring Algorithm Pending",
}

MIN_TOTAL_SIGNAL = 0.0
MIN_COVERED_AXES = 0


def normalize_scores(scores=None):
  return {key: 0.0 for key in DIMENSIONS}


def total_signal(scores=None):
  return 0.0


def covered_axes(scores=None):
  return 0


def has_enough_signal(scores=None):
  return False


def pair_winner(scores, left, right, default_left=True):
  return left if default_left else right


def decide_type(scores=None):
  return "UNCL"


def metrics(scores=None):
  return {key: 50 for key in METRIC_KEYS}


def trait_percentages(scores=None):
  return {key: 0 for key in DIMENSIONS}


def pair_clarity(scores=None):
  return {f"{left}{right}": 0 for left, right in PAIR_ORDER}


def confidence(scores=None, contradiction=None, scoring_meta=None):
  return 0


def mask_profile(phase_totals=None, contradiction=None):
  return {
    "selfImageType": "UNCL",
    "realPatternType": "UNCL",
    "comparisonAvailable": False,
    "maskLikely": False,
    "differences": [],
  }


def build_summary(*_args, **_kwargs):
  return "MBTI decision logic is currently blank. Add the new scoring algorithm to generate a type."


def build_decision(scores=None, contradiction=None, phase_totals=None, scoring_meta=None, function_scores=None):
  normalized_functions = normalize_function_scores(function_scores or {})
  return {
    "mbti": "UNCL",
    "type": "UNCL",
    "traitPatternType": "UNCL",
    "functionPatternType": "UNCL",
    "functionPatternScore": 0,
    "typeFunctionFit": 0,
    "typeEquationScores": {},
    "title": TYPE_TITLES["UNCL"],
    "isInconclusive": True,
    "signal": {
      "total": 0.0,
      "coveredAxes": 0,
      "requiredAxes": 0,
    },
    "confidence": 0,
    "honesty": 100,
    "metrics": metrics(),
    "totals": normalize_scores(),
    "traits": trait_percentages(),
    "functions": normalized_functions,
    "functionTotals": {key: 0.0 for key in COGNITIVE_FUNCTIONS},
    "shadowTendencies": [],
    "clarity": pair_clarity(),
    "mask": mask_profile(),
    "summary": build_summary(),
    "tags": ["Scoring pending"],
  }
