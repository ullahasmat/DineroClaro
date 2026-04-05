from fastapi import APIRouter
from pydantic import BaseModel

import anthropic
from ..core.config import settings

router = APIRouter()

SCAN_PROMPT = """You are a document legitimacy analyzer for DineroClaro, a financial app for the Hispanic community.

Your ONLY job is to analyze documents and respond with a JSON object. Do NOT greet the user. Do NOT give advice. Do NOT explain yourself. Respond with ONLY valid JSON.

If you receive an image, read ALL text visible in the image first, then analyze it. If the image is blurry or unreadable, still do your best to analyze whatever you can see.

Required format (no markdown, no backticks, no extra text — ONLY this JSON):
{"summary": "2-3 sentence plain-language summary", "legitimacy": "legit", "category": "important", "extracted_text": "all text you can read from the image or document"}

Rules for "legitimacy" field:
- "legit" — real document from a legitimate source (bank statement, pay stub, lease, utility bill, government letter)
- "suspicious" — could be real but has red flags (urgency, unusual requests, vague sender)
- "scam" — fake, fraudulent, or predatory (advance-fee scam, fake lottery, notario fraud, payday loan with hidden terms, phishing)

Rules for "category" field:
- "important" — documents you should keep (bank statements, tax forms, pay stubs, contracts)
- "sensitive" — contains personal info like SSN, ITIN, account numbers, medical info
- "trash" — junk mail, spam, confirmed scams, expired offers"""


class ScanRequest(BaseModel):
    document: str | None = None
    image_base64: str | None = None
    image_media_type: str | None = "image/jpeg"
    locale: str | None = "en"


class ScanResponse(BaseModel):
    reply: str


@router.post("/", response_model=ScanResponse)
async def scan(req: ScanRequest):
    if not settings.anthropic_api_key or settings.anthropic_api_key == "your-anthropic-api-key-here":
        return ScanResponse(reply='{"summary": "AI not configured", "legitimacy": "pending", "category": "important", "extracted_text": ""}')

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    lang_note = "Respond with the summary in Spanish." if req.locale == "es" else "Respond with the summary in English."

    # Build message content — image or text
    content: list = []

    if req.image_base64:
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": req.image_media_type or "image/jpeg",
                "data": req.image_base64,
            },
        })
        content.append({
            "type": "text",
            "text": "Read all text in this image, then analyze the document for legitimacy. Return ONLY JSON.",
        })
    elif req.document:
        content.append({"type": "text", "text": req.document})
    else:
        return ScanResponse(reply='{"summary": "No document or image provided", "legitimacy": "pending", "category": "important", "extracted_text": ""}')

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        system=SCAN_PROMPT + "\n\n" + lang_note,
        messages=[{"role": "user", "content": content}],
    )
    return ScanResponse(reply=response.content[0].text)
