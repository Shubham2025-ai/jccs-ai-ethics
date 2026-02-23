from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    APP_NAME: str = "JCCS - Jedi Code Compliance System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    SECRET_KEY: str = "change-this-in-production"

    # Render PostgreSQL sets this automatically
    DATABASE_URL: str = ""

    # Local MySQL fallback
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "jccs_db"
    DB_USER: str = "root"
    DB_PASSWORD: str = ""

    USE_SQLITE: bool = False

    GROQ_API_KEY: str = ""
    ORIGINSTAMP_API_KEY: str = ""
    FRONTEND_URL: str = "http://localhost:3000"
    MAX_FILE_SIZE_MB: int = 50
    UPLOAD_DIR: str = "uploads/"

    def get_database_url(self) -> str:
        # Priority 1: Direct DATABASE_URL (Render PostgreSQL)
        if self.DATABASE_URL:
            url = self.DATABASE_URL
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql://", 1)
            return url
        # Priority 2: SQLite
        if self.USE_SQLITE:
            os.makedirs("data", exist_ok=True)
            return "sqlite:///data/jccs.db"
        # Priority 3: MySQL local
        return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        env_file = ".env"

settings = Settings()