from fastapi import APIRouter

from ..schemas.chat import ChatRequest, ChatResponse
from ..services.chat_service import generate_reply

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat(req: ChatRequest):
    reply = generate_reply(
        message=req.message,
        user_id=req.user_id,
        locale=req.locale,
        life_stage=req.life_stage,
        name=req.name,
        age=req.age,
        area=req.area,
        credit_score=req.credit_score,
        income=req.income,
        checking=req.checking,
    )
    return ChatResponse(reply=reply, source="claude")
