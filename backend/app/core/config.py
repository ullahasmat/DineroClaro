from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

# Load .env from repo root (../..) or backend/.env if present
ROOT_ENV = Path(__file__).resolve().parents[3] / ".env"  # project/.env
BACKEND_ENV = Path(__file__).resolve().parents[2] / ".env"  # project/backend/.env
for env_path in (ROOT_ENV, BACKEND_ENV):
    if env_path.exists():
        load_dotenv(env_path)
        break


class Settings(BaseSettings):
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    supabase_url: str | None = None
    supabase_key: str | None = None
    database_url: str = "postgresql://postgres:postgres@localhost:5432/dineroclaro"
    environment: str = "development"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


def get_settings() -> Settings:
    return Settings()


settings = get_settings()
