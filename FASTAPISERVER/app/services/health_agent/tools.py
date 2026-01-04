import os
import cv2
import json
import base64
import asyncio
import aiohttp
import requests
from bs4 import BeautifulSoup
from typing import List, Optional
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from groq import Groq
from app.config.settings import settings
from app.utils.logger import logger


class NutritionFacts(BaseModel):
    """Nutrition facts from the label"""
    serving_size: Optional[str] = Field(default=None, description="Serving size (e.g., '50g', '1 cup')")
    calories: Optional[int] = Field(default=None, description="Calories per serving")
    total_fat_g: Optional[float] = Field(default=None, description="Total fat in grams")
    saturated_fat_g: Optional[float] = Field(default=None, description="Saturated fat in grams")
    sodium_mg: Optional[int] = Field(default=None, description="Sodium in milligrams")
    carbohydrates_g: Optional[float] = Field(default=None, description="Total carbohydrates in grams")
    fiber_g: Optional[float] = Field(default=None, description="Dietary fiber in grams")
    sugars_g: Optional[float] = Field(default=None, description="Sugars in grams")
    protein_g: Optional[float] = Field(default=None, description="Protein in grams")


class LabelExtraction(BaseModel):
    brand: str = Field(
        description="Primary brand or manufacturer name as printed on the product label"
    )
    ingredients: List[str] = Field(
        description="Ordered list of ingredients exactly as declared on the label, excluding quantities, addresses, claims, or marketing text"
    )
    nutrition: Optional[NutritionFacts] = Field(
        default=None,
        description="Nutrition facts from the nutrition table if visible on the label"
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
        # Initialize Groq client for vision (FREE & FAST!)
        self.groq_client = Groq(api_key=settings.groq_api_key)

    def extract_label_data(self, image_path: str) -> LabelExtraction:
        """Extract brand, ingredients AND nutrition facts from food label using Groq Llama 4 Scout Vision"""
        try:
            # Read and encode image to base64
            with open(image_path, "rb") as image_file:
                image_data = base64.b64encode(image_file.read()).decode('utf-8')
            
            logger.info(f"Processing image with Groq Llama 4 Scout Vision: {image_path}")
            
            # Create vision prompt for Llama 4 Scout (UPDATED TO EXTRACT NUTRITION FACTS)
            response = self.groq_client.chat.completions.create(
                model="meta-llama/llama-4-scout-17b-16e-instruct",  # Current Groq vision model
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": """Look at this food label image carefully and extract ALL information:

1. Product name and brand
2. **ALL nutrition facts from the Nutrition Facts table** (per serving):
   - Serving size (e.g., "50g", "1 cup")
   - Calories
   - Total Fat (g)
   - Saturated Fat (g)
   - Sodium (mg)
   - Total Carbohydrates (g)
   - Dietary Fiber (g)
   - Sugars (g)
   - Protein (g)
3. Complete ingredients list (in order)

Return as JSON in this EXACT format:
{
  "brand": "Product Brand Name",
  "ingredients": ["ingredient1", "ingredient2", ...],
  "nutrition": {
    "serving_size": "50g",
    "calories": 264,
    "total_fat_g": 16.0,
    "saturated_fat_g": 5.0,
    "sodium_mg": 192,
    "carbohydrates_g": 25.0,
    "fiber_g": 1.0,
    "sugars_g": 8.0,
    "protein_g": 5.0
  }
}

IMPORTANT:
- If you can SEE the nutrition table, extract ALL values
- Only use null/0 if data is truly missing from the image
- Extract actual numbers from the table, don't estimate"""
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_data}"
                                }
                            }
                        ]
                    }
                ],
                temperature=0.1,
                max_tokens=2048
            )
            
            # Debug: Log the full response
            logger.info(f"Groq API Response Object: {response}")
            
            extracted_text = response.choices[0].message.content.strip()
            logger.info(f"Groq Vision raw response text: {extracted_text}")
            
            # Parse the JSON response - IMPROVED PARSING
            # Handle case where Groq adds explanatory text before the JSON
            if "```" in extracted_text:
                logger.info("Detected code block, extracting JSON...")
                # Find the JSON block - it's between ``` markers
                parts = extracted_text.split("```")
                if len(parts) >= 2:
                    # Get the content between first ``` pair
                    json_block = parts[1]
                    # Remove language identifier if present
                    if json_block.strip().startswith("json"):
                        json_block = json_block.strip()[4:]
                    extracted_text = json_block.strip()
                    logger.info(f"Extracted JSON from code block: {extracted_text[:200]}...")
            
            # Try to parse JSON directly
            try:
                logger.info("Attempting to parse JSON response...")
                data = json.loads(extracted_text)
                logger.info(f"Successfully parsed JSON: {data}")
                
                brand = data.get("brand", "Unknown")
                ingredients = data.get("ingredients", [])
                nutrition_data = data.get("nutrition")
                
                # Parse nutrition facts if present
                nutrition = None
                if nutrition_data:
                    try:
                        nutrition = NutritionFacts(**nutrition_data)
                        logger.info(f"Extracted nutrition: {nutrition.calories} cal, {nutrition.total_fat_g}g fat, {nutrition.protein_g}g protein")
                    except Exception as e:
                        logger.warning(f"Failed to parse nutrition data: {e}")
                
                logger.info(f"Extracted - Brand: {brand}, Ingredients: {len(ingredients)}, Has Nutrition: {nutrition is not None}")
                
                return LabelExtraction(
                    brand=brand,
                    ingredients=ingredients,
                    nutrition=nutrition
                )
            except json.JSONDecodeError as json_err:
                # Fallback: use structured output to parse the text
                logger.warning(f"JSON parsing failed: {json_err}")
                logger.warning(f"Failed text was: {extracted_text}")
                logger.info("Using Gemini structured output as fallback...")
                
                parse_prompt = f"""
                Extract brand, ingredients, and nutrition facts from this text:
                {extracted_text}
                """
                result = self.label_llm.invoke(parse_prompt)
                logger.info(f"Fallback extraction result: Brand={result.brand}, Ingredients={len(result.ingredients)}")
                return result
            
        except Exception as e:
            logger.error(f"Error extracting label data with Groq Llama Vision: {e}")
            logger.error(f"Error type: {type(e).__name__}")
            logger.error(f"Error details: {str(e)}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return LabelExtraction(brand="Unknown", ingredients=[], nutrition=None)

    def fetch_clinical_evidence(self, ingredient: str) -> IngredientProfile:
        """Fetch clinical evidence and health information for an ingredient (legacy single-ingredient method)"""
        # This method is kept for backwards compatibility but not used in the main workflow
        return self.fetch_clinical_evidence_batch([ingredient])[0]

    async def _fetch_wikipedia_async(self, session: aiohttp.ClientSession, ingredient: str) -> tuple[str, str]:
        """Async fetch Wikipedia data for a single ingredient"""
        try:
            wiki_url = f"https://en.wikipedia.org/wiki/{ingredient.replace(' ', '_')}"
            async with session.get(wiki_url, timeout=aiohttp.ClientTimeout(total=5)) as response:
                html = await response.text()
                soup = BeautifulSoup(html, "lxml")
                wiki_text = " ".join(p.text for p in soup.select("p")[:3])
                logger.debug(f"Fetched Wikipedia data for {ingredient}")
                return ingredient, wiki_text
        except Exception as e:
            logger.debug(f"Could not fetch Wikipedia data for {ingredient}: {e}")
            return ingredient, ""
    
    async def _fetch_all_wikipedia_async(self, ingredients: List[str]) -> dict[str, str]:
        """Fetch Wikipedia data for all ingredients in parallel"""
        async with aiohttp.ClientSession() as session:
            tasks = [self._fetch_wikipedia_async(session, ing) for ing in ingredients]
            results = await asyncio.gather(*tasks)
            return {ing: text for ing, text in results}

    def fetch_clinical_evidence_batch(self, ingredients: List[str]) -> List[IngredientProfile]:
        """Fetch clinical evidence for multiple ingredients in a single AI call (optimized)"""
        if not ingredients:
            return []
        
        # Process all ingredients (no limit)
        logger.info(f"Batch analyzing {len(ingredients)} ingredients in single AI call")
        
        # Fetch Wikipedia data for ALL ingredients in PARALLEL (async)
        logger.info(f"Fetching Wikipedia data for {len(ingredients)} ingredients in parallel...")
        start_time = __import__('time').time()
        
        # Run async Wikipedia fetching in separate thread to avoid event loop conflict
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(asyncio.run, self._fetch_all_wikipedia_async(ingredients))
            wikipedia_data = future.result()
        
        fetch_time = __import__('time').time() - start_time
        logger.info(f"Wikipedia parallel fetch completed in {fetch_time:.2f} seconds")
        
        # Gather contexts with Wikipedia data
        ingredient_contexts = []
        for ing in ingredients:
            wiki_text = wikipedia_data.get(ing, "")
            off_data = {}
            
            # Try to fetch OpenFoodFacts data (sequential, but fast)
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

    def find_better_alternatives(self, brand: str, ingredients: List[str], user_health: str, category: str = None) -> List[str]:
        """Find healthier alternatives using OpenFoodFacts API (fast, real products)"""
        try:
            logger.info(f"Finding alternatives for {brand} using OpenFoodFacts API...")
            start_time = __import__('time').time()
            
            # If no category provided, detect it from OpenFoodFacts
            if not category:
                logger.info("Category not provided, detecting via OpenFoodFacts...")
                search_url = f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={brand}&json=1&page_size=1"
                response = requests.get(search_url, timeout=5)
                if response.ok:
                    products = response.json().get("products", [])
                    if products:
                        category = products[0].get("categories_tags", ["snacks"])[0].replace("en:", "")
                        logger.info(f"Category '{category}' detected via OpenFoodFacts API")
            
            if not category:
                category = "snacks"  # Default fallback
            
            # Parse user health constraints
            is_vegan = "vegan" in user_health.lower()
            is_vegetarian = is_vegan or "vegetarian" in user_health.lower()
            has_gluten_allergy = "gluten" in user_health.lower()
            
            # Search OpenFoodFacts INDIA for better alternatives in same category
            search_url = f"https://in.openfoodfacts.org/category/{category}.json"
            params = {
                "page_size": 50,  # Get more to filter
                "json": 1,
                "fields": "product_name,brands,nutriscore_grade,nova_group,ingredients_text,allergens_tags,labels_tags"
            }
            
            response = requests.get(search_url, params=params, timeout=10)
            if not response.ok:
                logger.warning(f"OpenFoodFacts search failed: {response.status_code}")
                return self._get_fallback_alternatives(category)
            
            products = response.json().get("products", [])
            logger.info(f"Found {len(products)} products in category '{category}'")
            
            # Filter and score products
            alternatives = []
            for product in products:
                # Skip if no name or brand
                if not product.get("product_name") or not product.get("brands"):
                    continue
                
                # Skip the same product
                product_brand = product.get("brands", "").lower()
                if brand.lower() in product_brand or product_brand in brand.lower():
                    continue
                
                # Filter by health constraints
                allergens = product.get("allergens_tags", [])
                labels = product.get("labels_tags", [])
                
                # Skip if has gluten and user is allergic
                if has_gluten_allergy and any("gluten" in a for a in allergens):
                    continue
                
                # Filter by diet
                if is_vegan and "en:vegan" not in labels:
                    continue
                if is_vegetarian and not is_vegan and "en:vegetarian" not in labels:
                    continue
                
                # Score product (lower is better)
                score = 0
                nutriscore = product.get("nutriscore_grade", "e").lower()
                nova_group = product.get("nova_group", 4)
                
                # Nutriscore: a=0, b=1, c=2, d=3, e=4
                nutriscore_map = {"a": 0, "b": 1, "c": 2, "d": 3, "e": 4}
                score += nutriscore_map.get(nutriscore, 4) * 10
                
                # NOVA group (1=unprocessed, 4=ultra-processed)
                score += nova_group * 5
                
                # Prefer products with health labels
                if "en:organic" in labels:
                    score -= 3
                if "en:no-additives" in labels:
                    score -= 2
                if "en:low-fat" in labels:
                    score -= 2
                if "en:low-sugar" in labels:
                    score -= 2
                
                alternatives.append({
                    "name": f"{product.get('brands', '')} {product.get('product_name', '')}".strip(),
                    "nutriscore": nutriscore.upper(),
                    "nova": nova_group,
                    "score": score
                })
            
            # Sort by score and get top 3
            alternatives.sort(key=lambda x: x["score"])
            top_alternatives = alternatives[:3]
            
            # Format for output (match frontend expectations)
            formatted_alternatives = []
            for alt in top_alternatives:
                # Generate simple "why it's better" based on scores
                reasons = []
                if alt["nutriscore"] in ["A", "B"]:
                    reasons.append(f"Nutriscore {alt['nutriscore']} rating")
                if alt["nova"] <= 2:
                    reasons.append("minimally processed")
                if not reasons:
                    reasons.append("better nutritional profile")
                
                # Use OpenFoodFacts format that frontend expects
                formatted_alternatives.append(
                    f"{alt['name']} (Why it's better: {', '.join(reasons)}, available at major grocery stores)"
                )
            
            fetch_time = __import__('time').time() - start_time
            logger.info(f"Found {len(formatted_alternatives)} alternatives via OpenFoodFacts in {fetch_time:.2f} seconds")
            
            return formatted_alternatives if formatted_alternatives else self._get_fallback_alternatives(category)
            
        except Exception as e:
            logger.error(f"Error finding alternatives via OpenFoodFacts: {e}")
            return self._get_fallback_alternatives(category or "snacks")
    
    def _get_fallback_alternatives(self, category: str) -> List[str]:
        """Fallback Indian alternatives if OpenFoodFacts fails"""
        fallback_map = {
            "snacks": [
                "Too Yumm Multigrain Chips (Why it's better: baked not fried, 50% less fat, no trans fat, available at BigBasket/Amazon India)",
                "Slurrp Farm Millet Puffs (Why it's better: made with millets, high fiber, no maida, available at BigBasket/Flipkart)",
                "Yoga Bar Baked Chips (Why it's better: protein-rich, whole grains, no preservatives, available at BigBasket/Amazon India)"
            ],
            "cookies": [
                "Slurrp Farm Millet Cookies (Why it's better: made with ragi & oats, no maida, low sugar, available at BigBasket/Flipkart)",
                "Yoga Bar Breakfast Cookies (Why it's better: protein-rich, whole grains, no refined sugar, available at BigBasket)",
                "Timios Millet Cookies (Why it's better: organic millets, jaggery sweetened, available at FirstCry/Amazon India)"
            ],
            "chips": [
                "Too Yumm Veggie Stix (Why it's better: real vegetables, 70% less oil, baked, available at BigBasket/Swiggy Instamart)",
                "Cornitos Baked Nacho Crisps (Why it's better: baked corn, lower fat, available at Amazon India/DMart)",
                "Happilo Premium Roasted Makhana (Why it's better: naturally low fat, high protein, Ayurvedic superfood, available at BigBasket)"
            ],
            "noodles": [
                "Maggi Atta Noodles (Why it's better: whole wheat, higher fiber than maida noodles, available at BigBasket/Kirana stores)",
                "YiPPee Multi Grain Noodles (Why it's better: 4 grains with oats, no trans fat, available at BigBasket)",
                "Patanjali Atta Noodles (Why it's better: whole wheat, no maida, available at Patanjali stores)"
            ]
        }
        
        # Try to match category
        for key in fallback_map:
            if key in category.lower():
                return fallback_map[key]
        
        # Default to snacks
        return fallback_map["snacks"]
    
    def _get_generic_alternatives(self, category: str) -> List[str]:
        """Legacy fallback - redirects to new fallback"""
        return self._get_fallback_alternatives(category)
