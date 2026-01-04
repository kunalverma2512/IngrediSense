"""Response models for API endpoints"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class IngredientProfileResponse(BaseModel):
    """Individual ingredient profile"""
    
    name: str = Field(..., description="Ingredient name")
    manufacturing: str = Field(..., description="Manufacturing origin")
    regulatory_gap: str = Field(..., description="Regulatory differences across regions")
    health_risks: str = Field(..., description="Known health effects")
    nova_score: int = Field(..., description="NOVA processing score (1-4)")


class HealthAnalysisResponse(BaseModel):
    """Complete health analysis response"""
    
    success: bool = Field(..., description="Whether the analysis was successful")
    brand_name: str = Field(..., description="Product brand name")
    ingredients_list: List[str] = Field(..., description="List of ingredients")
    user_clinical_profile: str = Field(..., description="User's health profile analysis")
    ingredient_knowledge_base: List[IngredientProfileResponse] = Field(
        ..., 
        description="Detailed profiles of ingredients"
    )
    clinical_risk_analysis: str = Field(..., description="Risk analysis based on user health")
    product_alternatives: List[str] = Field(..., description="Healthier alternative products")
    final_conversational_insight: str = Field(
        ..., 
        description="Conversational summary with recommendations"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "brand_name": "Example Cereal",
                "ingredients_list": ["Whole grain oats", "Sugar", "Salt"],
                "user_clinical_profile": "User is managing blood pressure (sodium sensitivity)",
                "ingredient_knowledge_base": [
                    {
                        "name": "Sugar",
                        "manufacturing": "Refined",
                        "regulatory_gap": "No major restrictions",
                        "health_risks": "May spike blood glucose",
                        "nova_score": 3
                    }
                ],
                "clinical_risk_analysis": "Moderate sodium content may affect blood pressure",
                "product_alternatives": ["Organic low-sodium cereal", "Homemade granola"],
                "final_conversational_insight": "🟡 CAUTION: This product contains moderate sodium..."
            }
        }


class ErrorResponse(BaseModel):
    """Error response model"""
    
    success: bool = Field(False, description="Always false for errors")
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Additional error details")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "error": "Invalid file format",
                "detail": "Only image files (jpg, png, webp) are allowed"
            }
        }


class HealthCheckResponse(BaseModel):
    """Health check response"""
    
    status: str = Field("healthy", description="Service status")
    version: str = Field(..., description="API version")
    timestamp: str = Field(..., description="Current server time")
