from .ai_service import generate_response


def chat(user_message: str) -> str:
    """Thin wrapper over AI generation."""
    return generate_response(user_message)
