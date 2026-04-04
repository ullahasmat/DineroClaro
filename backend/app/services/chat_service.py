from openai import OpenAI

from ..core.config import settings


SYSTEM_PROMPT = "You are DineroClaro, a concise financial literacy coach for Latin America."


def generate_reply(message: str, user_id: int | None = None, locale: str | None = "en") -> str:
    """Return a short answer. Falls back to a stub if no API key is set."""
    if not settings.openai_api_key:
        return "AI key not configured yet. Add OPENAI_API_KEY in .env."

    client = OpenAI(api_key=settings.openai_api_key)
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": message},
        ],
        temperature=0.4,
        max_tokens=200,
    )
    return completion.choices[0].message.content or "Sorry, I couldn't generate a reply."
