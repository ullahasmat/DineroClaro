from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    user_id: int | None = None
    locale: str | None = "en"


class ChatResponse(BaseModel):
    reply: str
    source: str | None = None
