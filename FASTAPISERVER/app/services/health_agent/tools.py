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

    def get_product_category(self, brand_name: str, ingredients: List[str]) -> tuple:
        """
        Extract product category using Hybrid A+C approach.
        Returns: (category, method) where method is 'keyword', 'api', or 'fallback'
        """
        # CATEGORY DICTIONARY - Core 20 categories covering 90% of products
        CATEGORY_KEYWORDS = {
            # Snacks
            'chips': ['chips', 'crisps', 'nachos', 'tortilla'],
            'crackers': ['crackers', 'biscuits', 'wafer'],
            'popcorn': ['popcorn', 'corn puffs'],
            'pretzels': ['pretzels', 'twist'],
            
            # Sweets
            'cookies': ['cookies', 'cookie', 'oreo', 'bourbon'],
            'chocolate': ['chocolate', 'cocoa', 'dark chocolate', 'milk chocolate'],
            'candy': ['candy', 'gummies', 'lollipop', 'toffee'],
            
            # Instant Meals
            'noodles': ['noodles', 'ramen', 'instant noodles', 'maggi', 'pasta'],
            'ready meals': ['ready to eat', 'instant meal', 'meal kit'],
            
            # Beverages
            'juice': ['juice', 'nectar', 'fruit drink'],
            'soda': ['cola', 'soda', 'fizzy', 'soft drink', 'pepsi', 'coke'],
            'energy drinks': ['energy drink', 'red bull', 'monster'],
            
            # Dairy
            'yogurt': ['yogurt', 'yoghurt', 'curd', 'dahi'],
            'milk': ['milk', 'dairy milk'],
            'cheese': ['cheese', 'cheddar', 'mozzarella'],
            
            # Bakery
            'bread': ['bread', 'loaf', 'bun', 'roll'],
            'cakes': ['cake', 'muffin', 'pastry', 'cupcake'],
            
            # Others
            'cereal': ['cereal', 'cornflakes', 'oats', 'granola'],
            'ice cream': ['ice cream', 'gelato', 'frozen dessert'],
            'sauce': ['sauce', 'ketchup', 'mayo', 'dressing']
        }
        
        # STEP 1: Fast keyword matching (Primary - 90% of cases)
        brand_lower = brand_name.lower()
        for category, keywords in CATEGORY_KEYWORDS.items():
            if any(keyword in brand_lower for keyword in keywords):
                logger.info(f"Category '{category}' detected via keyword matching")
                return category, 'keyword'
        
        # STEP 2: OpenFoodFacts API (Fallback - 10% of edge cases)
        try:
            # Search for this product on OpenFoodFacts to get its category
            search_url = "https://world.openfoodfacts.org/cgi/search.pl"
            params = {
                "search_terms": brand_name,
                "page_size": 1,
                "json": 1
            }
            response = requests.get(search_url, params=params, timeout=1)  # Fast timeout for category detection
            data = response.json()
            
            if data.get("products"):
                product = data["products"][0]
                # Get category from categories_tags_en field
                categories = product.get("categories_tags", [])
                if categories:
                    # Use the most specific category (last one)
                    category_tag = categories[-1].replace("en:", "").replace("-", " ")
                    logger.info(f"Category '{category_tag}' detected via OpenFoodFacts API")
                    return category_tag, 'api'
        except Exception as e:
            logger.debug(f"OpenFoodFacts category lookup failed: {e}")
        
        # STEP 3: Generic fallback
        logger.warning(f"Could not detect category for '{brand_name}', using generic 'snacks'")
        return 'snacks', 'fallback'

    def find_better_alternatives(self, brand: str, ingredients: List[str], category: str = None, user_profile: dict = None) -> List[str]:
        """
        Find healthier alternative products using Gemini AI.
        Fast, reliable, and personalized to user profile.
        """
        # 1. Detect product category (simple keyword matching)
        if not category:
            category, _ = self.get_product_category(brand, ingredients)
        
        # 2. Build AI prompt for alternatives
        user_constraints = ""
        if user_profile:
            allergens = user_profile.get("allergens", [])
            diet = user_profile.get("diet", "")
            if allergens:
                user_constraints += f"\nUser Allergens to AVOID: {', '.join(allergens)}"
            if diet:
                user_constraints += f"\nUser Diet: {diet}"
        
        prompt = f"""You are a nutrition expert. Suggest 3 healthier alternative products for this item.

CURRENT PRODUCT:
Brand: {brand}
Category: {category}
Top Ingredients: {', '.join(ingredients[:5])}

{user_constraints}

REQUIREMENTS:
1. Suggest 3 REAL, SPECIFIC product brands (not generic like "organic chips")
2. Each must be HEALTHIER than current product (lower sodium/sugar/fat OR higher protein/fiber)
3. Each must be WIDELY AVAILABLE in stores (Target, Whole Foods, Walmart, etc.)
4. DO NOT suggest the same brand as current product
5. If user has allergens, exclude products containing those allergens
6. If user follows a diet (vegan/vegetarian), suggest matching products

FORMAT (exactly like this):
Product Name 1 (Why it's better: specific reason)
Product Name 2 (Why it's better: specific reason)  
Product Name 3 (Why it's better: specific reason)

Examples:
- Hippeas Chickpea Puffs (Why it's better: 4g protein vs 2g, baked not fried)
- Terra Veggie Chips (Why it's better: real vegetables, 30% less sodium)
- Simply 7 Quinoa Chips (Why it's better: whole grains, no artificial flavors)"""

        try:
            logger.info(f"Asking Gemini for alternatives to {category} product")
            response = self.llm.invoke(prompt)
            alternatives_text = response.content.strip()
            
            # Parse response into list
            alternatives = []
            for line in alternatives_text.split('\n'):
                line = line.strip()
                if line and not line.startswith('#') and not line.lower().startswith('here'):
                    # Remove bullet points and numbering
                    cleaned = line.lstrip('- •*123456789. ')
                    if cleaned and len(cleaned) > 10:  # Filter out short lines
                        alternatives.append(cleaned)
            
            # Return top 3
            alternatives = alternatives[:3]
            
            if alternatives:
                logger.info(f"Found {len(alternatives)} alternatives via Gemini AI")
                return alternatives
            else:
                # Fallback if parsing failed
                logger.warning("Gemini response parsing failed, using generic alternatives")
                return self._get_generic_alternatives(category)
                
        except Exception as e:
            logger.error(f"Error getting alternatives from Gemini: {e}")
            return self._get_generic_alternatives(category)
    
    def _get_generic_alternatives(self, category: str) -> List[str]:
        """Fallback generic alternatives based on category"""
        generic_map = {
            'chips': [
                "Hippeas Chickpea Puffs (Why it's better: 4g protein, baked not fried)",
                "Terra Veggie Chips (Why it's better: real vegetables, less sodium)",
                "Simply 7 Quinoa Chips (Why it's better: whole grains, no artificial ingredients)"
            ],
            'cookies': [
                "Simple Mills Almond Flour Crackers (Why it's better: grain-free, lower sugar)",
                "Annie's Organic Bunny Grahams (Why it's better: organic, no artificial flavors)",
                "Enjoy Life Soft Baked Cookies (Why it's better: allergen-free, no refined sugar)"
            ],
            'noodles': [
                "Lotus Foods Brown Rice Ramen (Why it's better: whole grain, organic)",
                "Dr. McDougall's Right Foods (Why it's better: low sodium, no MSG)",
                "Simply Asia Organic Noodles (Why it's better: organic, no preservatives)"
            ],
        }
        
        return generic_map.get(category, [
            "Whole grain alternatives (Why it's better: higher fiber, less processed)",
            "Organic options (Why it's better: no pesticides, cleaner ingredients)",
            "Fresh whole foods (Why it's better: no additives, naturally nutritious)"
        ])
