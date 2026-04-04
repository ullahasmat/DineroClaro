from fastapi import APIRouter

from ..schemas.chat import ChatRequest, ChatResponse
from ..services.chat_service import generate_reply

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat(req: ChatRequest):
    reply = generate_reply(req.message, req.user_id, req.locale)
    return ChatResponse(reply=reply, source="openai" if reply else None)
