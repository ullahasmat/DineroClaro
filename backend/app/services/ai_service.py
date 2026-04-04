from pathlib import Path

from openai import OpenAI

from ..core.config import settings


PROMPT_PATH = Path(__file__).resolve().parents[3] / "ai" / "prompts" / "chat.md"


def _load_system_prompt() -> str:
    if PROMPT_PATH.exists():
        return PROMPT_PATH.read_text(encoding="utf-8")
    return "You are DineroClaro, respond with JSON."


def generate_response(user_message: str) -> str:
    """Generate an AI response using the system prompt and user message."""
    if not settings.openai_api_key:
        return '{"answer":"Missing OPENAI_API_KEY","steps":[],"warning":"Set OPENAI_API_KEY"}'

    client = OpenAI(api_key=settings.openai_api_key)
    system_prompt = _load_system_prompt()

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        max_tokens=300,
        temperature=0.4,
    )
    return completion.choices[0].message.content or ""
