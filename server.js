import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSubmitHandler, submitTest } from "./api/submitTest.js";
import { createIqScoreHandler } from "./api/scoreIq.js";
import { createTurnstileHandler } from "./api/verifyTurnstile.js";
import {
  bodySizeGuard,
  corsGuard,
  createRateLimiter,
  enforceHttps,
  methodGuard,
  requireJsonForApi,
  securityConfig,
  securityHeaders,
  validateApiPayload
} from "./middleware/security.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 8000);

export const app = express();

if (process.env.TRUST_PROXY) {
  app.set("trust proxy", process.env.TRUST_PROXY);
}

app.disable("x-powered-by");
app.use(methodGuard());
app.use(enforceHttps());
app.use(securityHeaders());
app.use(corsGuard());
app.use(bodySizeGuard());
app.use(createRateLimiter({
  name: "global",
  windowMs: securityConfig.globalWindowMs,
  max: securityConfig.globalMax
}));
app.use("/api", createRateLimiter({
  name: "api",
  windowMs: securityConfig.apiWindowMs,
  max: securityConfig.apiMax
}));
app.use("/api", createRateLimiter({
  name: "api-burst",
  windowMs: securityConfig.burstWindowMs,
  max: securityConfig.burstMax
}));
app.use("/api", requireJsonForApi());

app.use(express.json({
  limit: securityConfig.maxBodyBytes,
  strict: true
}));
app.use("/api", validateApiPayload());

app.post("/api/verify-turnstile", createTurnstileHandler());
app.post("/api/submit-test", createSubmitHandler());
app.post("/api/mbti/analyze", (req, res, next) => {
  try {
    res.json(submitTest({ testType: "mbti", answers: req.body?.answers || [] }));
  } catch (error) {
    next(error);
  }
});

app.post("/api/iq/score", createIqScoreHandler());

app.post("/api/eq/analyze", (req, res, next) => {
  try {
    res.json(submitTest({ testType: "eq", answers: req.body?.answers || [] }));
  } catch (error) {
    next(error);
  }
});

app.post("/api/potential/analyze", (req, res, next) => {
  try {
    const report = submitTest({ testType: req.body?.testType || "mbti", answers: req.body?.answers || [] });
    res.json({
      type: report.type,
      title: report.title,
      metrics: report.metrics,
      potential: report.potential,
      scope: report.scope,
      advantage: report.advantage,
      growthRisks: report.growthRisks,
      next30Days: report.next30Days,
      confidence: report.confidence,
      source: "answer-weighted-potential-api"
    });
  } catch (error) {
    next(error);
  }
});

app.use(express.static(__dirname, {
  dotfiles: "ignore",
  etag: true,
  maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
  setHeaders(res, filePath) {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-store");
    }
  }
}));

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const status = Number(error?.status || error?.statusCode || 400);
  const safeStatus = status >= 400 && status < 600 ? status : 400;

  res.status(safeStatus).json({
    error: safeStatus === 413 ? "Request body too large." : "Unable to analyze submitted answers.",
    detail: process.env.NODE_ENV === "production"
      ? "Request could not be processed."
      : (error?.message || "Unknown scoring error.")
  });
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = app.listen(PORT, () => {
    console.log(`CogniLens engine running at http://localhost:${PORT}`);
  });

  server.requestTimeout = 15_000;
  server.headersTimeout = 16_000;
  server.keepAliveTimeout = 5_000;
}
