from fastapi import APIRouter
from pydantic import BaseModel

from app.services.chat_service import chat

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    try:
        result = chat(request.message)
        return {"reply": result}
    except Exception as exc:
        return {"reply": f"I cannot reach the AI service right now. Please try again. ({exc})"}
