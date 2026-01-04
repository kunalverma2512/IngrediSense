"""Health analysis API routes"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from datetime import datetime
from app.models.requests import HealthAnalysisRequest, URLAnalysisRequest
from app.models.responses import (
    HealthAnalysisResponse,
    ErrorResponse,
    HealthCheckResponse,
    IngredientProfileResponse
)
from app.services.health_agent import build_health_copilot
from app.utils.file_handler import file_handler
from app.utils.logger import logger
from app.config.settings import settings
from langchain_google_genai import ChatGoogleGenerativeAI
import os

router = APIRouter(prefix="/api/v1", tags=["health-analysis"])

# Initialize LLM
llm = ChatGoogleGenerativeAI(
    model=settings.gemini_model,
    temperature=settings.gemini_temperature,
    google_api_key=settings.google_api_key
)

# Build health copilot workflow
health_copilot = build_health_copilot(llm)


@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint"""
    return HealthCheckResponse(
        status="healthy",
        version=settings.app_version,
        timestamp=datetime.now().isoformat()
    )


@router.post("/analyze", response_model=HealthAnalysisResponse)
async def analyze_food_label(
    file: UploadFile = File(..., description="Food label image"),
    user_health_profile: str = File(..., description="User's health profile")
):
    """
    Analyze a food product label from an uploaded image
    
    - **file**: Food label image (jpg, png, webp)
    - **user_health_profile**: User's health conditions or dietary restrictions
    
    Returns detailed health analysis including:
    - Brand and ingredient extraction
    - Clinical health profiling
    - Ingredient risk assessment
    - Product alternatives
    - Conversational health insights
    """
    
    file_path = None
    
    try:
        logger.info(f"Received analysis request for file: {file.filename}")
        
        # Save uploaded file
        file_path = file_handler.save_upload_file(file)
        
        # Prepare inputs for health copilot
        inputs = {
            "image_path": file_path,
            "user_raw_health": user_health_profile
        }
        
        logger.info("Running health copilot analysis...")
        
        # Run health copilot workflow
        result = health_copilot.invoke(inputs)
        
        logger.info(f"Analysis complete for brand: {result.get('brand_name', 'Unknown')}")
        
        # Convert ingredient knowledge base to response models
        ingredient_profiles = []
        for item in result.get("ingredient_knowledge_base", []):
            # Handle both dict and Pydantic model
            if hasattr(item, 'dict'):
                item_dict = item.dict() if hasattr(item, 'dict') else item.model_dump()
            else:
                item_dict = item
            
            ingredient_profiles.append(IngredientProfileResponse(
                name=item_dict.get("name", "Unknown"),
                manufacturing=item_dict.get("manufacturing", "Unknown"),
                regulatory_gap=item_dict.get("regulatory_gap", "No data"),
                health_risks=item_dict.get("health_risks", "No data"),
                nova_score=item_dict.get("nova_score", 3)
            ))
        
        # Build response
        response = HealthAnalysisResponse(
            success=True,
            brand_name=result.get("brand_name", "Unknown"),
            ingredients_list=result.get("ingredients_list", []),
            user_clinical_profile=result.get("user_clinical_profile", ""),
            ingredient_knowledge_base=ingredient_profiles,
            clinical_risk_analysis=result.get("clinical_risk_analysis", ""),
            product_alternatives=result.get("product_alternatives", []),
            final_conversational_insight=result.get("final_conversational_insight", "")
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error during analysis: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )
    
    finally:
        # Cleanup uploaded file
        if file_path and os.path.exists(file_path):
            file_handler.cleanup_file(file_path)


@router.post("/analyze-url", response_model=HealthAnalysisResponse)
async def analyze_food_label_from_url(request: URLAnalysisRequest):
    """
    Analyze a food product label from an image URL
    
    - **image_url**: Public URL of the food label image
    - **user_health_profile**: User's health conditions or dietary restrictions
    
    Returns the same detailed analysis as the upload endpoint
    """
    
    file_path = None
    
    try:
        logger.info(f"Received analysis request for URL: {request.image_url}")
        
        # Download image from URL
        file_path = file_handler.download_from_url(request.image_url)
        
        # Prepare inputs for health copilot
        inputs = {
            "image_path": file_path,
            "user_raw_health": request.user_health_profile
        }
        
        logger.info("Running health copilot analysis...")
        
        # Run health copilot workflow
        result = health_copilot.invoke(inputs)
        
        logger.info(f"Analysis complete for brand: {result.get('brand_name', 'Unknown')}")
        
        # Convert ingredient knowledge base to response models
        ingredient_profiles = []
        for item in result.get("ingredient_knowledge_base", []):
            # Handle both dict and Pydantic model
            if hasattr(item, 'dict'):
                item_dict = item.dict() if hasattr(item, 'dict') else item.model_dump()
            else:
                item_dict = item
            
            ingredient_profiles.append(IngredientProfileResponse(
                name=item_dict.get("name", "Unknown"),
                manufacturing=item_dict.get("manufacturing", "Unknown"),
                regulatory_gap=item_dict.get("regulatory_gap", "No data"),
                health_risks=item_dict.get("health_risks", "No data"),
                nova_score=item_dict.get("nova_score", 3)
            ))
        
        # Build response
        response = HealthAnalysisResponse(
            success=True,
            brand_name=result.get("brand_name", "Unknown"),
            ingredients_list=result.get("ingredients_list", []),
            user_clinical_profile=result.get("user_clinical_profile", ""),
            ingredient_knowledge_base=ingredient_profiles,
            clinical_risk_analysis=result.get("clinical_risk_analysis", ""),
            product_alternatives=result.get("product_alternatives", []),
            final_conversational_insight=result.get("final_conversational_insight", "")
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during URL analysis: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )
    
    finally:
        # Cleanup downloaded file
        if file_path and os.path.exists(file_path):
            file_handler.cleanup_file(file_path)
