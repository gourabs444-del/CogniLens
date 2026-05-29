const ONE_MINUTE = 60 * 1000;
const TEN_SECONDS = 10 * 1000;

const DEFAULT_LOCAL_ORIGINS = [
  "http://localhost:5500",
  "http://localhost:5501",
  "http://localhost:8000",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5501",
  "http://127.0.0.1:8000"
];

function toPositiveInt(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : fallback;
}

function parseOrigins(value) {
  return String(value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const securityConfig = Object.freeze({
  maxBodyBytes: toPositiveInt(process.env.COGNILENS_MAX_BODY_BYTES, 256 * 1024),
  maxAnswers: toPositiveInt(process.env.COGNILENS_MAX_ANSWERS, 120),
  globalWindowMs: toPositiveInt(process.env.COGNILENS_GLOBAL_RATE_WINDOW_MS, ONE_MINUTE),
  globalMax: toPositiveInt(process.env.COGNILENS_GLOBAL_RATE_MAX, 240),
  apiWindowMs: toPositiveInt(process.env.COGNILENS_API_RATE_WINDOW_MS, ONE_MINUTE),
  apiMax: toPositiveInt(process.env.COGNILENS_API_RATE_MAX, 70),
  burstWindowMs: toPositiveInt(process.env.COGNILENS_BURST_RATE_WINDOW_MS, TEN_SECONDS),
  burstMax: toPositiveInt(process.env.COGNILENS_BURST_RATE_MAX, 24),
  allowedOrigins: parseOrigins(process.env.COGNILENS_ALLOWED_ORIGINS),
  enforceHttps: process.env.COGNILENS_ENFORCE_HTTPS === "1"
});

const stores = new Map();

function getStore(name) {
  if (!stores.has(name)) stores.set(name, new Map());
  return stores.get(name);
}

function pruneStore(store, now) {
  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

function getClientIp(req) {
  return req.ips?.[0] || req.ip || req.socket?.remoteAddress || "unknown";
}

function isHttps(req) {
  return Boolean(req.secure || req.headers["x-forwarded-proto"] === "https");
}

function sameOrigin(req, origin) {
  if (!origin) return true;
  const protocol = isHttps(req) ? "https" : req.protocol;
  return origin === protocol + "://" + req.get("host");
}

function allowedOrigin(req, origin) {
  if (!origin) return true;
  if (sameOrigin(req, origin)) return true;
  const configured = securityConfig.allowedOrigins.length
    ? securityConfig.allowedOrigins
    : DEFAULT_LOCAL_ORIGINS;
  return configured.includes(origin);
}

export function methodGuard() {
  const allowed = new Set(["GET", "HEAD", "POST", "OPTIONS"]);
  return (req, res, next) => {
    if (allowed.has(req.method)) {
      next();
      return;
    }
    res.setHeader("Allow", Array.from(allowed).join(", "));
    res.status(405).json({ error: "Method not allowed." });
  };
}

export function enforceHttps() {
  return (req, res, next) => {
    if (!securityConfig.enforceHttps || isHttps(req) || req.hostname === "localhost" || req.hostname === "127.0.0.1") {
      next();
      return;
    }
    res.redirect(308, "https://" + req.get("host") + req.originalUrl);
  };
}

export function securityHeaders() {
  return (req, res, next) => {
    res.removeHeader("X-Powered-By");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("X-DNS-Prefetch-Control", "off");
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
    );
    res.setHeader(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "form-action 'self' https://accounts.google.com",
        "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://www.gstatic.com https://apis.google.com https://challenges.cloudflare.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https://lh3.googleusercontent.com https://*.googleusercontent.com",
        "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 https://*.googleapis.com https://*.firebaseio.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com",
        "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://challenges.cloudflare.com",
        "worker-src 'self' blob:"
      ].join("; ")
    );

    if (isHttps(req)) {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }

    next();
  };
}

export function corsGuard() {
  return (req, res, next) => {
    const origin = req.headers.origin;
    res.setHeader("Vary", "Origin");

    if (allowedOrigin(req, origin)) {
      if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
      }
      res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      res.setHeader("Access-Control-Max-Age", "600");

      if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
      }

      next();
      return;
    }

    if (req.path.startsWith("/api/")) {
      res.status(403).json({ error: "Origin not allowed." });
      return;
    }

    next();
  };
}

export function bodySizeGuard() {
  return (req, res, next) => {
    const contentLength = Number(req.headers["content-length"] || 0);
    if (contentLength > securityConfig.maxBodyBytes) {
      res.status(413).json({ error: "Request body too large." });
      return;
    }
    next();
  };
}

export function createRateLimiter({ name, windowMs, max }) {
  const store = getStore(name);
  return (req, res, next) => {
    const now = Date.now();
    if (store.size > 5000) pruneStore(store, now);

    const key = getClientIp(req);
    const current = store.get(key);
    const bucket = current && current.resetAt > now
      ? current
      : { count: 0, resetAt: now + windowMs };

    bucket.count += 1;
    store.set(key, bucket);

    const remaining = Math.max(0, max - bucket.count);
    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > max) {
      res.setHeader("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
      res.status(429).json({
        error: "Too many requests.",
        detail: "Please wait before trying again."
      });
      return;
    }

    next();
  };
}

export function requireJsonForApi() {
  return (req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
      next();
      return;
    }

    if (!req.is("application/json")) {
      res.status(415).json({ error: "API requests must use application/json." });
      return;
    }

    next();
  };
}

export function validateApiPayload() {
  return (req, res, next) => {
    if (req.method !== "POST") {
      next();
      return;
    }

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({ error: "Invalid JSON payload." });
      return;
    }

    if (req.body.answers !== undefined) {
      if (!Array.isArray(req.body.answers)) {
        res.status(422).json({ error: "answers must be an array." });
        return;
      }

      if (req.body.answers.length > securityConfig.maxAnswers) {
        res.status(422).json({ error: "Too many answers in one request." });
        return;
      }
    }

    next();
  };
}
