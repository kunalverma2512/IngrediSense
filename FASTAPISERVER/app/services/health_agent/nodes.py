from .state import HealthCoPilotState
from .tools import ProHealthTools
from langchain_google_genai import ChatGoogleGenerativeAI
from app.utils.logger import logger

class AgentNodes:
    def __init__(self, llm: ChatGoogleGenerativeAI):
        self.llm = llm
        self.tools = ProHealthTools(llm)

    def extractor_node(self, state: HealthCoPilotState):
        data = self.tools.extract_label_data(state["image_path"])
        nutrition_dict = data.nutrition.dict() if data.nutrition else None
        return {
            "brand_name": data.brand,
            "ingredients_list": data.ingredients,
            "nutrition_facts": nutrition_dict
        }

    def health_profiler_node(self, state: HealthCoPilotState):
        prompt = f"""
        SYSTEM: Clinical Health Profiler.
        INPUT: {state['user_raw_health']}
        TASK: Convert user symptoms or diseases into precise bio-chemical triggers (e.g., 'Hypertension' -> 'Sodium/Vasoconstrictors').
        """
        res = self.llm.invoke(prompt)
        return {"user_clinical_profile": res.content}

    def researcher_node(self, state: HealthCoPilotState):
        # Batch analyze all ingredients in a single AI call (optimized!)
        knowledge = self.tools.fetch_clinical_evidence_batch(state["ingredients_list"])
        
        # Parse user profile for alternatives filtering
        # user_raw_health is a string like "Allergies: Peanuts, Gluten. Dietary preferences: Vegan"
        user_profile_dict = {}
        raw_profile = state.get("user_raw_health", "")
        if raw_profile:
            # Extract allergens
            if "Allergies:" in raw_profile or "allergies:" in raw_profile.lower():
                # Simple extraction - this is basic, can be improved
                allergens_part = raw_profile.split("Allergies:")[-1].split(".")[0] if "Allergies:" in raw_profile else raw_profile.split("allergies:")[-1].split(".")[0]
                user_profile_dict["allergens"] = [a.strip().lower() for a in allergens_part.split(",") if a.strip()]
            
            # Extract diet
            if "vegan" in raw_profile.lower():
                user_profile_dict["diet"] = "vegan"
            elif "vegetarian" in raw_profile.lower():
                user_profile_dict["diet"] = "vegetarian"
        
        
        alternatives = self.tools.find_better_alternatives(
            state["brand_name"], 
            state["ingredients_list"],
            user_health=state["user_raw_health"],  # Pass raw health string for OpenFoodFacts
            category=None  # Will be auto-detected from OpenFoodFacts
        )
        return {"ingredient_knowledge_base": knowledge, "product_alternatives": alternatives}

    def risk_analyzer_node(self, state: HealthCoPilotState):
        prompt = f"""
        SYSTEM: Clinical Reasoning Engine.
        USER: {state['user_clinical_profile']}
        PRODUCT DATA: {state['ingredient_knowledge_base']}
        TASK: Conduct a risk analysis.
        1. Identify direct conflicts between user health and ingredient manufacturing.
        2. Highlight 'Regulatory Gaps' (e.g., banned in EU but user is consuming it).
        3. Quantify uncertainty if scientific data is conflicting.
        """
        res = self.llm.invoke(prompt)
        return {"clinical_risk_analysis": res.content}

    def conversational_designer_node(self, state: HealthCoPilotState):
        # Extract key info for enriched, contextual response
        brand = state['brand_name']
        ingredients = state['ingredients_list']  # All ingredients for full context
        risks = state['clinical_risk_analysis']
        alts = state['product_alternatives']
        profile = state['user_clinical_profile']
        ingredient_kb = state['ingredient_knowledge_base']  # All ingredient analysis
        nutrition = state.get('nutrition_facts')  # CRITICAL: Actual nutrition data from OCR
        
        # Format nutrition data for prompt
        nutrition_info = "NOT AVAILABLE ON LABEL"
        if nutrition:
            nutrition_info = f"""AVAILABLE (use these EXACT values):
- Serving Size: {nutrition.get('serving_size', 'Unknown')}
- Calories/Energy: {nutrition.get('calories', 0)} kcal per serving
- Total Fat: {nutrition.get('total_fat_g', 0)}g
- Saturated Fat: {nutrition.get('saturated_fat_g', 0)}g  
- Sodium: {nutrition.get('sodium_mg', 0)}mg
- Carbohydrates: {nutrition.get('carbohydrates_g', 0)}g
- Fiber: {nutrition.get('fiber_g', 0)}g
- Sugars: {nutrition.get('sugars_g', 0)}g
- Protein: {nutrition.get('protein_g', 0)}g
- Potassium: {nutrition.get('potassium_mg', 'not listed')}mg
- Iron: {nutrition.get('iron_mg', 'not listed')}mg"""
        
        # Detect if product is a natural whole food
        natural_food_keywords = ['date', 'dates', 'fruit', 'fruits', 'nuts', 'almonds', 'cashews', 
                                  'raisins', 'dried', 'fresh', 'honey', 'jaggery', 'makhana', 'foxnuts']
        is_natural_food = any(keyword in brand.lower() or keyword in ' '.join(ingredients).lower() 
                              for keyword in natural_food_keywords)
        
        product_type_hint = ""
        if is_natural_food:
            product_type_hint = """
**PRODUCT TYPE: NATURAL WHOLE FOOD**
This appears to be a natural, minimally processed food (like dates, fruits, nuts). 
- Such foods are generally SAFE and BENEFICIAL for most people
- Quick Decision should reflect this: "Generally safe!" or "OK to enjoy"
- Only say "Skip" if user has a SPECIFIC known allergy to this exact food
- For Better Options: Say "This is already a healthy choice!" and suggest complementary foods, NOT processed alternatives like chips
"""
        
        prompt = f"""**STRICT OUTPUT FORMAT – NO EXCEPTIONS:**
You MUST include ALL 6 components below. Competition judging focuses on co-pilot behavior and HONEST UNCERTAINTY.

You are an AI health co-pilot for a 21-year-old user (72kg, 176cm, BMI 23.2, ~2000 cal/day needs).

CONTEXT:
Product: {brand}
Key Ingredients: {', '.join(ingredients)}
NUTRITION FACTS: {nutrition_info}
User Health Profile: {profile}
Risk Analysis: {risks[:500]}
Ingredient Details: {ingredient_kb}
Available Alternatives: {alts}
{product_type_hint}

**ANTI-JARGON RULES (CRITICAL):**
❌ NEVER use: "mast cell degranulation", "Mycobacterium tuberculosis", "3-MCPD esters", "cytokine release", "histamine pathways"
✅ ALWAYS use: "immune cells releasing chemicals", "the TB bacteria", "palm oil processing byproducts", "inflammation signals", "allergy response"

**TALK LIKE A HELPFUL FRIEND, NOT A SCIENTIST.**

**CRITICAL: NO SPECULATION WITHOUT EVIDENCE**
❌ NEVER say: "Some spices can be mixed with harmful things" (speculative without proof)
✅ ONLY mention confirmed ingredients from the label
✅ Put uncertain connections in "What I'm Unsure About" section
✅ If making claims, qualify: "Some studies suggest..." or "In certain cases..."

**CRITICAL: QUICK DECISION MUST REFLECT ACTUAL ANALYSIS**
- If the product is generally safe (like natural fruits, dates, nuts) → Say "Safe to eat" or "OK to enjoy"
- If it has minor concerns but is still acceptable → Say "OK in moderation" 
- ONLY say "Skip" if there are MAJOR health risks (high sodium + heart issues, allergen present + known allergy)
- Don't be overly cautious! Natural whole foods are usually fine.

**CRITICAL: USE THESE EXACT SECTION HEADERS - NO VARIATIONS!**
You MUST include these 6 sections with EXACT header names:
1. 🤔 Scanning your {{brand}}...
2. **Quick Decision:** [content]
3. **Why This Matters To You:**
4. **Tradeoffs:** [content]
5. **What I'm Unsure About:**
6. **Better Options:**

DO NOT use variations like "Carbohydrates and Fiber Labeling" or "Ground Spices Blend" as top-level headers!
These should be INSIDE the "What I'm Unsure About:" section.

MANDATORY OUTPUT STRUCTURE:

🤔 Scanning your {{brand}}...

**Quick Decision:** [Based on ACTUAL analysis:
- "Generally safe! [Benefit]" → for whole foods, natural products with no major concerns
- "OK in moderation. [Brief reason]" → for products with some concerns but still acceptable
- "Not ideal, consider alternatives. [Reason]" → for processed foods with multiple concerns
- "Skip this one. [Critical reason]" → ONLY for products with major health risks relevant to user's conditions]

**Why This Matters To You:**
- **[Condition 1]**: [QUANTIFY with exact % of daily needs. Use ACTUAL nutrition data if available. Example: "This 264-calorie serving (per 50g) is 13% of your ~2000 daily needs" - NOT "Let's estimate 264 calories"]
- **[Condition 2]**: [Explain WHAT ingredient IS in simple terms + regulatory fact. Example: "White sesame (FDA-required allergen label since 2023) can trigger severe allergic reactions"]
- **[Condition 3]**: [Use SIMPLE mechanism. Example: "Refined flour spikes blood sugar, which can worsen inflammation" NOT "histamine pathways"]

**Tradeoffs:** [One sentence: benefit vs risk + age context in plain language. Example: "A healthy, nutrient-dense snack that supports your energy needs, just wash thoroughly as the label instructs."]

**What I'm Unsure About:**
List 2-3 specific uncertainties with honest explanations:
- **[Missing Label Info]**: [What's not on the label + why it matters. Example: "Ground Spices Blend: Label doesn't list which spices - can't confirm if turmeric is present, which can interact with some TB medications"]
- **[Processing Details]**: [Unspecified processing methods + impact. Example: "Palm Oil Processing: Label doesn't specify refined vs unrefined, making it hard to quantify exact byproduct levels"]
- **[Conflicting Evidence]**: [If research is mixed. Example: "Research is mixed on whether X affects Y in people under 25"]

**Better Options:** 🛒 [SPECIFIC product brands with store names - ONLY if current product has significant issues, otherwise say "This is already a good choice!" or suggest complementary items]
- [Brand Name] (Why it's better: specific reason, available at: BigBasket/Amazon India)

CRITICAL REQUIREMENTS:

1. **Nutrition Quantification** (EXACT math):
   - Daily calorie needs: ~2000 for 21-year-old male, 72kg
   - If you have ACTUAL calorie data, say "This 264-calorie serving" NOT "Let's estimate 264 calories"
   - Calculate exact percentages: "X calories = Y% of daily needs"
   - Relate to specific conditions: "TB patients often need lower sodium than the 192mg here"

2. **Plain English ONLY**:
   - Replace ALL scientific terms with conversational language
   - Use analogies: "immune system going into overdrive" NOT "cytokine release"
   - Test: Would a non-scientist friend understand this?

3. **Honest Uncertainty** (CRITICAL - 30% of score):
   - MUST include "What I'm Unsure About" section
   - Be specific about what's missing from the label
   - Explain why the uncertainty matters
   - Don't speculate - admit when you don't know

4. **Actionable Alternatives**:
   - SPECIFIC brand names (Hippeas, Terra, Simple Mills, etc.)
   - Include WHERE to buy ("available at Target", "online delivery")
   - DON'T just say "roasted chickpeas" - say "Hippeas Chickpea Puffs"

5. **Age/BMI Personalization**:
   - Use exact stats: "As a 21-year-old with healthy BMI 23.2..."
   - Age-specific recovery: "Your body can handle mild inflammation better at 21, but TB needs extra care"

6. **Evidence-Based Only**:
   - Only mention confirmed ingredients from the label
   - If ingredient is vague (like "Ground Spices"), put concerns in "What I'm Unsure About"
   - Don't make claims about ingredients that might not be present

7. **Co-Pilot Feel**:
   - Do the work FOR the user (give brands, not suggestions to research)
   - Be proactive ("Here are 2 options I found for you")
   - Friendly emoji use: 🛒 for shopping, ⚠️ for warnings

GOOD EXAMPLES:
- "This 264-calorie serving (per 50g) is 13% of your ~2000 daily needs - adds up if you snack regularly"
- "White sesame can trigger severe allergic reactions (FDA requires labeling since 2023)"
- "Refined flour spikes blood sugar, which can worsen sinus swelling"
- "🛒 Try Hippeas Chickpea Puffs (Target, $4) or Terra Veggie Chips (lower fat)"
- "At 21, your immune system bounces back quickly, but TB means being extra careful"

BAD EXAMPLES (avoid):
- "Let's estimate 264 calories" (if you have actual data!)
- "Some spices can be mixed with lead" (speculative without proof)
- "Triggers mast cell degranulation" (too technical)
- "Try roasted chickpeas" (not specific enough)
- Missing "What I'm Unsure About" section (automatic point deduction!)

Generate NOW. Sound like a smart, helpful friend who ADMITS when they don't know something - NOT a research paper.

REMINDER: You MUST include ALL 6 sections with these EXACT headers:
1. Scanning message with 🤔
2. **Quick Decision:**
3. **Why This Matters To You:**
4. **Tradeoffs:**
5. **What I'm Unsure About:**
6. **Better Options:**"""
        
        res = self.llm.invoke(prompt)
        
        # DEBUG LOGGING - Check if all sections are present
        response_text = res.content
        logger.info("="*80)
        logger.info("GEMINI RESPONSE - FULL TEXT:")
        logger.info(response_text)
        logger.info("="*80)
        logger.info("SECTION HEADER CHECK:")
        logger.info(f"  Has 'Quick Decision': {'**Quick Decision' in response_text or 'Quick Decision' in response_text}")
        logger.info(f"  Has 'Why This Matters': {'Why This Matters' in response_text}")
        logger.info(f"  Has 'Tradeoffs': {'**Tradeoffs' in response_text or 'Tradeoffs' in response_text}")
        logger.info(f"  Has 'Unsure About': {'Unsure About' in response_text}")
        logger.info(f"  Has 'Better Options': {'Better Options' in response_text}")
        logger.info("="*80)
        
        return {"final_conversational_insight": response_text}
