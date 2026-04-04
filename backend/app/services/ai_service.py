from openai import OpenAI

from ..core.config import settings


client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None


def simple_completion(prompt: str, model: str = "gpt-4o-mini") -> str:
    if client is None:
        return "OpenAI key not configured."
    completion = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
        temperature=0.5,
    )
    return completion.choices[0].message.content or ""
