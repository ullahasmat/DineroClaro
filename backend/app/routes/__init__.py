from .chat import router as chat_router
from .health import router as health_router
from .recommendations import router as recommendations_router

__all__ = ["chat_router", "health_router", "recommendations_router"]
