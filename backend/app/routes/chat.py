from fastapi import APIRouter
from pydantic import BaseModel

from ..services.chat_service import chat

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@router.post("/", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest) -> ChatResponse:
    ai_text = chat(req.message)
    return ChatResponse(response=ai_text)
