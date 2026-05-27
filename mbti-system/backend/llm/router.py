import os
from pathlib import Path


_DOTENV_LOADED = False


def load_dotenv():
  global _DOTENV_LOADED
  if _DOTENV_LOADED:
    return
  _DOTENV_LOADED = True

  env_path = Path(__file__).resolve().parents[1] / ".env"
  if not env_path.exists():
    return

  for raw_line in env_path.read_text(encoding="utf-8").splitlines():
    line = raw_line.strip()
    if not line or line.startswith("#") or "=" not in line:
      continue
    key, value = line.split("=", 1)
    key = key.strip()
    value = value.strip().strip('"').strip("'")
    os.environ.setdefault(key, value)


def env(*keys, default=""):
  load_dotenv()
  for key in keys:
    value = os.getenv(key)
    if value:
      return value
  return default


def provider_order():
  configured = env("COGNILENS_LLM_PROVIDERS", default="openrouter,deepseek,groq,openai,gemini")
  return [item.strip().lower() for item in configured.split(",") if item.strip()]


def route_for_result(result):
  confidence = int(result.get("confidence", 0) or 0)
  honesty = int(result.get("honesty", 100) or 100)
  if confidence >= 75 and honesty >= 75:
    return "detailed"
  if honesty < 60:
    return "careful"
  return "balanced"


def provider_configs():
  configs = {
    "openrouter": {
      "name": "openrouter",
      "kind": "openai-compatible",
      "api_key": env("COGNILENS_OPENROUTER_API_KEY", "OPENROUTER_API_KEY"),
      "base_url": env("OPENROUTER_BASE_URL", default="https://openrouter.ai/api/v1/chat/completions"),
      "model": env("OPENROUTER_MODEL", default="google/gemini-2.0-flash-001"),
      "headers": {
        "HTTP-Referer": env("OPENROUTER_HTTP_REFERER", default="http://localhost:8000"),
        "X-Title": env("OPENROUTER_APP_TITLE", default="CogniLens MBTI Engine"),
      },
    },
    "deepseek": {
      "name": "deepseek",
      "kind": "openai-compatible",
      "api_key": env("COGNILENS_DEEPSEEK_API_KEY", "DEEPSEEK_API_KEY"),
      "base_url": env("DEEPSEEK_BASE_URL", default="https://api.deepseek.com/chat/completions"),
      "model": env("DEEPSEEK_MODEL", default="deepseek-chat"),
      "headers": {},
    },
    "groq": {
      "name": "groq",
      "kind": "openai-compatible",
      "api_key": env("COGNILENS_GROQ_API_KEY", "GROQ_API_KEY"),
      "base_url": env("GROQ_BASE_URL", default="https://api.groq.com/openai/v1/chat/completions"),
      "model": env("GROQ_MODEL", default="llama-3.1-8b-instant"),
      "headers": {},
    },
    "openai": {
      "name": "openai",
      "kind": "openai-compatible",
      "api_key": env("COGNILENS_OPENAI_API_KEY", "OPENAI_API_KEY"),
      "base_url": env("OPENAI_BASE_URL", default="https://api.openai.com/v1/chat/completions"),
      "model": env("OPENAI_MODEL", default="gpt-4o-mini"),
      "headers": {},
    },
    "gemini": {
      "name": "gemini",
      "kind": "gemini",
      "api_key": env("COGNILENS_GEMINI_API_KEY", "GEMINI_API_KEY"),
      "base_url": env("GEMINI_BASE_URL", default="https://generativelanguage.googleapis.com/v1beta/models"),
      "model": env("GEMINI_MODEL", default="gemini-1.5-flash"),
      "headers": {},
    },
  }
  return [configs[name] for name in provider_order() if name in configs and configs[name]["api_key"]]
