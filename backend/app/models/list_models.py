# backend/list_models.py
import os
from dotenv import load_dotenv
from google import genai

# Load environment variables from .env
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY", "").strip()
if not api_key:
    raise SystemExit("GEMINI_API_KEY not set")

client = genai.Client(api_key=api_key)
models = client.models.list()
print(list(models))