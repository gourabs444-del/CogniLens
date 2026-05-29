const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_TOKEN_LENGTH = 2048;
const LOCAL_TEST_SECRET = "1x0000000000000000000000000000000AA";

function getTurnstileSecret() {
  const configured = process.env.TURNSTILE_SECRET_KEY || process.env.CLOUDFLARE_TURNSTILE_SECRET;
  if (configured) return configured;
  return process.env.NODE_ENV === "production" ? "" : LOCAL_TEST_SECRET;
}

function getClientIp(req) {
  const forwarded = String(req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  return forwarded || req.ips?.[0] || req.ip || req.socket?.remoteAddress || "";
}

async function postToSiteverify(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const body = await response.json().catch(() => ({}));
    return { ok: response.ok, body };
  } finally {
    clearTimeout(timeout);
  }
}

export function createTurnstileHandler() {
  return async (req, res, next) => {
    try {
      const token = String(req.body?.token || req.body?.response || "").trim();
      const action = String(req.body?.action || "auth").slice(0, 64);
      const secret = getTurnstileSecret();

      if (!secret) {
        res.status(500).json({
          success: false,
          error: "Turnstile secret key is not configured."
        });
        return;
      }

      if (!token || token.length > MAX_TOKEN_LENGTH) {
        res.status(400).json({
          success: false,
          error: "Missing or invalid Turnstile token."
        });
        return;
      }

      const { ok, body } = await postToSiteverify({
        secret,
        response: token,
        remoteip: getClientIp(req),
        idempotency_key: crypto.randomUUID()
      });

      if (!ok) {
        res.status(502).json({
          success: false,
          error: "Turnstile verification service did not respond cleanly."
        });
        return;
      }

      const success = Boolean(body?.success);
      res.status(success ? 200 : 403).json({
        success,
        action,
        hostname: body?.hostname || null,
        challengeTs: body?.challenge_ts || null,
        errors: Array.isArray(body?.["error-codes"]) ? body["error-codes"] : []
      });
    } catch (error) {
      if (error?.name === "AbortError") {
        res.status(504).json({
          success: false,
          error: "Turnstile verification timed out."
        });
        return;
      }
      next(error);
    }
  };
}
