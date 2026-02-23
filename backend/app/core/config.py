from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # App
    APP_NAME: str = "JCCS - Jedi Code Compliance System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    SECRET_KEY: str = "change-this-in-production"

    # Database mode — set USE_SQLITE=true in .env for deployment
    USE_SQLITE: bool = False

    # MySQL (local development)
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "jccs_db"
    DB_USER: str = "root"
    DB_PASSWORD: str = ""

    # Groq (Free AI API)
    GROQ_API_KEY: str = ""

    # OriginStamp (Free Bitcoin blockchain anchoring — originstamp.com)
    ORIGINSTAMP_API_KEY: str = ""

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    # Upload
    MAX_FILE_SIZE_MB: int = 50
    UPLOAD_DIR: str = "uploads/"

    @property
    def DATABASE_URL(self) -> str:
        if self.USE_SQLITE:
            # SQLite — file-based, zero setup, perfect for deployment
            os.makedirs("data", exist_ok=True)
            return "sqlite:///data/jccs.db"
        # MySQL — for local development
        return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        env_file = ".env"

settings = Settings()