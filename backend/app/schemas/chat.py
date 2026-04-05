from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    user_id: int | None = None
    locale: str | None = "en"
    life_stage: str | None = None   # new-arrival | first-gen | established
    age: str | None = None
    area: str | None = None


class ChatResponse(BaseModel):
    reply: str
    source: str | None = None
