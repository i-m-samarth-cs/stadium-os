from pydantic_settings import BaseSettings, SettingsConfigDict

from pydantic import field_validator
from typing import List
import os

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # Database
    DATABASE_URL: str = "sqlite:///./stadiumos.db"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # AI Settings
    NVIDIA_API_KEY: str = ""

    # Simulation settings
    SIMULATION_ENABLED: bool = False
    SIMULATION_INTERVAL: int = 5  # seconds

    @field_validator("BACKEND_CORS_ORIGINS", mode='before')
    @classmethod
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()