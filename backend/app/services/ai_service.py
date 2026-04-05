import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI


def generate_response(user_message: str) -> str:
    root_env = Path(__file__).resolve().parents[3] / ".env"
    backend_env = Path(__file__).resolve().parents[2] / ".env"
    if root_env.exists():
        load_dotenv(root_env)
    elif backend_env.exists():
        load_dotenv(backend_env)

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set.")

    prompt_path = Path(__file__).resolve().parents[3] / "ai" / "prompts" / "chat.md"
    if not prompt_path.exists():
        raise RuntimeError(f"System prompt file not found: {prompt_path}")

    system_prompt = prompt_path.read_text(encoding="utf-8")

    try:
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
        )
        return response.choices[0].message.content or ""
    except Exception as exc:
        raise RuntimeError(f"Failed to generate OpenAI response: {exc}") from exc
