# CogniLens MBTI Backend

Run from this folder:

```powershell
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Put API keys in `.env`. The frontend calls `http://localhost:8000/api/mbti/analyze` by default and falls back to local scoring if the backend is offline.
