"""Application settings and configuration"""

import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Configuration
    app_name: str = "Health Agent API"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Google AI Configuration
    google_api_key: str
    gemini_model: str = "gemini-2.5-flash"
    gemini_temperature: float = 0.1
    
    # Groq Configuration (for Llama 3.2-11B Vision - FREE!)
    groq_api_key: str
    
    # CORS Configuration  
    cors_origins_str: str = "http://localhost:3000,http://localhost:5173,http://localhost:5174"
    
    @property
    def cors_origins(self) -> list:
        """Parse CORS origins string into list"""
        return [origin.strip() for origin in self.cors_origins_str.split(",")]
    
    # File Upload Configuration
    upload_dir: str = "uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions_str: str = "jpg,jpeg,png,webp"
    
    @property
    def allowed_extensions(self) -> set:
        """Parse allowed extensions string into set"""
        # Add dots to extensions if not present
        extensions = [ext.strip() for ext in self.allowed_extensions_str.split(",")]
        return {f".{ext}" if not ext.startswith(".") else ext for ext in extensions}
    
    # Logging Configuration
    log_level: str = "INFO"
    log_file: str = "logs/app.log"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Create global settings instance
settings = Settings()
