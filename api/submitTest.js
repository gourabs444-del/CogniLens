import { traitDefinitions } from "../data/traits.js";
import { scoreTraits } from "../engine/traitEngine.js";
import { analyzeMbti } from "../engine/mbtiEngine.js";
import { analyzeEq } from "../engine/eqEngine.js";
import { analyzeContradictions } from "../engine/contradictionEngine.js";
import { calculateConfidence } from "../engine/confidenceEngine.js";
import { buildReasoning } from "../engine/reasoningEngine.js";
import { generateReport } from "./generateReport.js";

function isDebugEnabled() {
  if (typeof window !== "undefined" && window.COGNILENS_DEBUG) return true;
  if (typeof process !== "undefined" && process.env?.COGNILENS_DEBUG === "1") return true;
  return false;
}

function debugEngine({ traitResult, mbti }) {
  if (!isDebugEnabled()) return;
  console.log("rawFunctionScores", traitResult.rawFunctionScores || {});
  console.log("rawTraitScores", traitResult.rawTraitScores || {});
  console.log("normalizedTraits", traitResult.normalizedTraits || traitResult.normalized || {});
  console.log("finalMbtiScores", mbti.finalMbtiScores || {});
}

function normalizeArgs(input, maybeAnswers) {
  if (typeof input === "string") return { testType: input, answers: maybeAnswers || [] };
  return {
    testType: input?.testType || input?.type || input?.category || "mbti",
    answers: input?.answers || maybeAnswers || []
  };
}

export function submitTest(input, maybeAnswers) {
  const { testType, answers } = normalizeArgs(input, maybeAnswers);

  const traitResult = scoreTraits({ testType, answers });
  const mbti = analyzeMbti(traitResult);
  const eq = analyzeEq(traitResult);
  const contradiction = analyzeContradictions({ traitResult, eq });
  const confidence = calculateConfidence({ traitResult, contradiction });
  const reasoning = buildReasoning({ traitResult, mbti, eq, confidence, contradiction });
  debugEngine({ traitResult, mbti });

  return generateReport({
    testType,
    answers,
    traitResult,
    mbti,
    eq,
    contradiction,
    confidence,
    reasoning,
    traitDefinitions
  });
}

export function createSubmitHandler() {
  return (req, res, next) => {
    try {
      res.json(submitTest(req.body || {}));
    } catch (error) {
      next(error);
    }
  };
}

export function installSubmitGlobals(target = globalThis) {
  target.CogniLensAPI = {
    ...(target.CogniLensAPI || {}),
    submitTest,
    generateReport
  };
}

if (typeof window !== "undefined") installSubmitGlobals(window);

export default submitTest;
