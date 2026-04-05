from app.services.ai_service import generate_response


def chat(user_message: str) -> str:
    return generate_response(user_message)
