import os
import cv2
import json
import requests
import pytesseract
from bs4 import BeautifulSoup
from typing import List
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config.settings import settings
from app.utils.logger import logger

# Set Tesseract path if provided in settings, otherwise rely on auto-detection (macOS)
if settings.tesseract_cmd:
    pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd


class LabelExtraction(BaseModel):
    brand: str = Field(
        description="Primary brand or manufacturer name as printed on the product label"
    )
    ingredients: List[str] = Field(
        description="Ordered list of ingredients exactly as declared on the label, excluding quantities, addresses, claims, or marketing text"
    )


class IngredientProfile(BaseModel):
    name: str = Field(
        description="Standardized ingredient name used for scientific and regulatory reference"
    )
    manufacturing: str = Field(
        description="Production origin of the ingredient such as natural, synthetic, fermented, or ultra-processed"
    )
    regulatory_gap: str = Field(
        description="Differences or concerns in regulatory approval, bans, warnings, or limits across regions or countries"
    )
    health_risks: str = Field(
        description="Summary of known or suspected health effects based on clinical, epidemiological, or toxicological evidence"
    )
    nova_score: int = Field(
        description="NOVA food classification score indicating degree of processing (1=minimally processed, 4=ultra-processed)"
    )


class ProHealthTools:
    def __init__(self, llm: ChatGoogleGenerativeAI):
        self.llm = llm  # Store base LLM for batch analysis
        self.label_llm = llm.with_structured_output(LabelExtraction)
        self.profile_llm = llm.with_structured_output(IngredientProfile)

    def extract_label_data(self, image_path: str) -> LabelExtraction:
        """Extract brand and ingredients from food label image using OCR"""
        try:
            image = cv2.imread(image_path)
            if image is None:
                logger.error(f"Could not read image: {image_path}")
                return LabelExtraction(brand="Unknown", ingredients=[])
            
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            raw_text = pytesseract.image_to_string(gray)
            
            logger.info(f"OCR extracted text from {image_path}")
            
            prompt = f"""
            You are a high-precision OCR and label parser.
            TEXT:
            {raw_text}
            Identify the product brand and extract only the ingredient list.
            """
            return self.label_llm.invoke(prompt)
            
        except Exception as e:
            logger.error(f"Error extracting label data: {e}")
            return LabelExtraction(brand="Unknown", ingredients=[])

    def fetch_clinical_evidence(self, ingredient: str) -> IngredientProfile:
        """Fetch clinical evidence and health information for an ingredient (legacy single-ingredient method)"""
        # This method is kept for backwards compatibility but not used in the main workflow
        return self.fetch_clinical_evidence_batch([ingredient])[0]

    def fetch_clinical_evidence_batch(self, ingredients: List[str]) -> List[IngredientProfile]:
        """Fetch clinical evidence for multiple ingredients in a single AI call (optimized)"""
        if not ingredients:
            return []
        
        # Limit to 10 ingredients to keep prompt manageable
        ingredients = ingredients[:10]
        
        # Gather external data for each ingredient
        ingredient_contexts = []
        for ing in ingredients:
            wiki_text = ""
            off_data = {}
            
            # Try to fetch Wikipedia context
            try:
                wiki_url = f"https://en.wikipedia.org/wiki/{ing.replace(' ', '_')}"
                soup = BeautifulSoup(requests.get(wiki_url, timeout=5).text, "html.parser")
                wiki_text = " ".join(p.text for p in soup.select("p")[:3])
                logger.debug(f"Fetched Wikipedia data for {ing}")
            except Exception as e:
                logger.debug(f"Could not fetch Wikipedia data for {ing}: {e}")
            
            # Try to fetch OpenFoodFacts data
            try:
                off_url = f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={ing}&json=1"
                off_data = requests.get(off_url, timeout=5).json().get("products", [{}])[0]
                logger.debug(f"Fetched OpenFoodFacts data for {ing}")
            except Exception as e:
                logger.debug(f"Could not fetch OpenFoodFacts data for {ing}: {e}")
            
            # Build context string for this ingredient
            context = f"- {ing}"
            if wiki_text:
                context += f"\n  Wikipedia: {wiki_text[:200]}..."
            if off_data:
                context += f"\n  OpenFoodFacts: {json.dumps(off_data)[:100]}..."
            
            ingredient_contexts.append(context)
        
        # Single batch prompt for all ingredients with enriched context
        prompt = f"""You are a clinical nutrition and food safety researcher. Analyze the following ingredients and return a JSON array of ingredient profiles.

INGREDIENTS TO ANALYZE (with available scientific context):
{chr(10).join(ingredient_contexts)}

For EACH ingredient, provide:
1. name: Standardized ingredient name
2. manufacturing: Production origin (natural/synthetic/fermented/ultra-processed)
3. regulatory_gap: Regulatory differences or bans across regions (research and determine actual status)
4. health_risks: Known or suspected health effects based on evidence
5. nova_score: NOVA classification (1=minimally processed, 4=ultra-processed)

Return as a JSON array with exactly {len(ingredients)} objects, one for each ingredient listed above.
Use the provided scientific context from Wikipedia and OpenFoodFacts, plus your knowledge of regulatory databases to assess each ingredient.
"""
        
        try:
            # Call AI once for all ingredients
            logger.info(f"Batch analyzing {len(ingredients)} ingredients in single AI call")
            response = self.llm.invoke(prompt)
            
            # Parse JSON response
            content = response.content.strip()
            # Remove markdown code blocks if present
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
            
            profiles_data = json.loads(content)
            
            # Convert to IngredientProfile objects
            profiles = []
            for i, data in enumerate(profiles_data):
                try:
                    profiles.append(IngredientProfile(
                        name=data.get("name", ingredients[i]),
                        manufacturing=data.get("manufacturing", "Unknown"),
                        regulatory_gap=data.get("regulatory_gap", "No data"),
                        health_risks=data.get("health_risks", "No data"),
                        nova_score=data.get("nova_score", 3)
                    ))
                except Exception as e:
                    logger.warning(f"Error parsing profile for ingredient {i}: {e}")
                    # Fallback profile
                    profiles.append(IngredientProfile(
                        name=ingredients[i],
                        manufacturing="Unknown",
                        regulatory_gap="No major regulatory restrictions identified",
                        health_risks="Data unavailable",
                        nova_score=3
                    ))
            
            logger.info(f"Successfully analyzed {len(profiles)} ingredients in batch")
            return profiles
            
        except Exception as e:
            logger.error(f"Error in batch ingredient analysis: {e}")
            # Return default profiles for all ingredients
            return [
                IngredientProfile(
                    name=ing,
                    manufacturing="Unknown",
                    regulatory_gap="No major regulatory restrictions identified",
                    health_risks="Data unavailable due to API error",
                    nova_score=3
                )
                for ing in ingredients
            ]

    def find_better_alternatives(self, brand: str, ingredients: List[str]) -> List[str]:
        """Find healthier alternative products"""
        search_term = brand if brand != "Unknown" else ingredients[0] if ingredients else "Organic"
        
        try:
            url = f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={search_term}&nova_group=1&json=1"
            data = requests.get(url, timeout=5).json()
            alternatives = [p.get("product_name") for p in data.get("products", [])[:2] if p.get("product_name")]
            logger.info(f"Found {len(alternatives)} alternatives for {search_term}")
            return alternatives
        except Exception as e:
            logger.error(f"Error finding alternatives: {e}")
            return []
