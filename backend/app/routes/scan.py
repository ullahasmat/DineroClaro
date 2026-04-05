from fastapi import APIRouter
from pydantic import BaseModel

import anthropic
from ..core.config import settings

router = APIRouter()

SCAN_PROMPT = """You are a document legitimacy analyzer for DineroClaro, a financial app for the Hispanic community.

Your ONLY job is to analyze documents and respond with a JSON object. Do NOT greet the user. Do NOT give advice. Do NOT explain yourself. Respond with ONLY valid JSON.

Required format (no markdown, no backticks, no extra text — ONLY this JSON):
{"summary": "2-3 sentence plain-language summary", "legitimacy": "legit", "category": "important"}

Rules for "legitimacy" field:
- "legit" — real document from a legitimate source (bank statement, pay stub, lease, utility bill, government letter)
- "suspicious" — could be real but has red flags (urgency, unusual requests, vague sender)
- "scam" — fake, fraudulent, or predatory (advance-fee scam, fake lottery, notario fraud, payday loan with hidden terms, phishing)

Rules for "category" field:
- "important" — documents you should keep (bank statements, tax forms, pay stubs, contracts)
- "sensitive" — contains personal info like SSN, ITIN, account numbers, medical info
- "trash" — junk mail, spam, confirmed scams, expired offers"""


class ScanRequest(BaseModel):
    document: str
    locale: str | None = "en"


class ScanResponse(BaseModel):
    reply: str


@router.post("/", response_model=ScanResponse)
async def scan(req: ScanRequest):
    if not settings.anthropic_api_key or settings.anthropic_api_key == "your-anthropic-api-key-here":
        return ScanResponse(reply='{"summary": "AI not configured", "legitimacy": "pending", "category": "important"}')

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    lang_note = "Respond with the summary in Spanish." if req.locale == "es" else "Respond with the summary in English."

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        system=SCAN_PROMPT + "\n\n" + lang_note,
        messages=[{"role": "user", "content": req.document}],
    )
    return ScanResponse(reply=response.content[0].text)
