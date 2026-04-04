from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import chat, recommendations, health, financial

app = FastAPI(title="DineroClaro API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
app.include_router(financial.router, prefix="/financial", tags=["financial"])


@app.get("/")
async def root():
    return {"status": "ok", "service": "DineroClaro API"}
