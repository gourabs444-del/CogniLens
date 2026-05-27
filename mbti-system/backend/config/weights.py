DIMENSIONS = ("I", "E", "N", "S", "T", "F", "J", "P")

PAIR_ORDER = (
  ("E", "I"),
  ("S", "N"),
  ("T", "F"),
  ("J", "P"),
)

METRIC_KEYS = ("I", "N", "T", "J")

SELECT_POINTS = 10
ALLOCATION_TOTAL = 10

PHASE_WEIGHTS = {
  "P1": 15.0,
  "P2": 20.0,
  "P3": 30.0,
  "P4": 35.0,
}

PHASE_PURPOSE = {
  "P1": "self_image",
  "P2": "hidden_preference",
  "P3": "behavioral_contradiction",
  "P4": "rapid_instinct",
}

REACTION_THRESHOLDS_MS = {
  "very_fast": 1200,
  "fast": 2500,
  "steady": 6000,
  "slow": 12000,
}
