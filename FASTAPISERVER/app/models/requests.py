"""Request models for API endpoints"""

from pydantic import BaseModel, Field
from typing import Optional


class HealthAnalysisRequest(BaseModel):
    """Request model for health analysis with user health profile"""
    
    user_health_profile: str = Field(
        ...,
        description="User's health conditions, concerns, or dietary restrictions",
        example="I have diabetes and avoid high sugar products"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_health_profile": "I am managing cardiovascular health and avoid synthetic dyes/ultra-processed additives."
            }
        }


class URLAnalysisRequest(BaseModel):
    """Request model for analyzing food label from image URL"""
    
    image_url: str = Field(
        ...,
        description="Public URL of the food label image",
        example="https://example.com/food-label.jpg"
    )
    user_health_profile: str = Field(
        ...,
        description="User's health conditions, concerns, or dietary restrictions",
        example="I have diabetes and avoid high sugar products"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "image_url": "https://example.com/cereal-label.jpg",
                "user_health_profile": "I am managing cardiovascular health and avoid synthetic dyes."
            }
        }
