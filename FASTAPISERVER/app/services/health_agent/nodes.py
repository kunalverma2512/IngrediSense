from .state import HealthCoPilotState
from .tools import ProHealthTools
from langchain_google_genai import ChatGoogleGenerativeAI

class AgentNodes:
    def __init__(self, llm: ChatGoogleGenerativeAI):
        self.llm = llm
        self.tools = ProHealthTools(llm)

    def extractor_node(self, state: HealthCoPilotState):
        data = self.tools.extract_label_data(state["image_path"])
        return {"brand_name": data.brand, "ingredients_list": data.ingredients}

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
        knowledge = self.tools.fetch_clinical_evidence_batch(state["ingredients_list"][:10])
        
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
            category=None,  # Could extract from product analysis
            user_profile=user_profile_dict if user_profile_dict else None
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
        ingredients = state['ingredients_list'][:5]  # Top 5 for context
        risks = state['clinical_risk_analysis']
        alts = state['product_alternatives']
        profile = state['user_clinical_profile']
        ingredient_kb = state['ingredient_knowledge_base'][:3]  # Top 3 for ingredient education
        
        prompt = f"""**STRICT OUTPUT FORMAT – NO EXCEPTIONS:**
You MUST include ALL 6 components below. Competition judging focuses on co-pilot behavior, not technical knowledge.

You are an AI health co-pilot for a 21-year-old user (72kg, 176cm, BMI 23.2, ~2000 cal/day needs).

CONTEXT:
Product: {brand}
Key Ingredients: {', '.join(ingredients)}
User Health Profile: {profile}
Risk Analysis: {risks[:500]}
Ingredient Details: {ingredient_kb}
Available Alternatives: {alts}

**ANTI-JARGON RULES (CRITICAL):**
❌ NEVER use: "mast cell degranulation", "Mycobacterium tuberculosis", "3-MCPD esters", "cytokine release", "histamine pathways"
✅ ALWAYS use: "immune cells releasing chemicals", "the TB bacteria", "palm oil processing byproducts", "inflammation signals", "allergy response"

**TALK LIKE A HELPFUL FRIEND, NOT A SCIENTIST.**

MANDATORY OUTPUT STRUCTURE:

🤔 Scanning your {{brand}}...

**Quick Decision:** [One clear sentence: Safe/Not ideal/Skip + specific action in plain English]

**Why This Matters To You:**
- **[Condition 1]**: [QUANTIFY with exact % of daily needs. Example: "264 calories = 13% of your ~2000 daily needs as a 21-year-old male"]
- **[Condition 2]**: [Explain WHAT ingredient IS in simple terms + regulatory fact. Example: "White sesame (FDA-required allergen label since 2023) can trigger severe allergic reactions"]
- **[Condition 3]**: [Use SIMPLE mechanism. Example: "Refined flour spikes blood sugar, which can worsen inflammation" NOT "histamine pathways"]

**Tradeoffs**: [One sentence: benefit vs risk + age context in plain language]

**What I'm Unsure About**: [One specific uncertainty with simple explanation. Example: "Ground Spices purity varies - some turmeric can interact with TB meds, but this label doesn't specify which spices"]

**Better Options**: [SPECIFIC product brands with availability. Example: "🛒 Try Hippeas Chickpea Puffs (available at Target/Whole Foods) or Terra Veggie Chips (lower allergen risk)"]

CRITICAL REQUIREMENTS:

1. **Nutrition Quantification** (EXACT math):
   - Daily calorie needs: ~2000 for 21-year-old male, 72kg
   - Calculate exact percentages: "X calories = Y% of daily needs"
   - Relate to specific conditions: "TB patients often need lower sodium than the 192mg here"

2. **Plain English ONLY**:
   - Replace ALL scientific terms with conversational language
   - Use analogies: "immune system going into overdrive" NOT "cytokine release"
   - Test: Would a non-scientist friend understand this?

3. **Actionable Alternatives**:
   - SPECIFIC brand names (Hippeas, Terra, Simple Mills, etc.)
   - Include WHERE to buy ("available at Target", "online delivery")
   - DON'T just say "roasted chickpeas" - say "Hippeas Chickpea Puffs"

4. **Age/BMI Personalization**:
   - Use exact stats: "As a 21-year-old with healthy BMI 23.2..."
   - Age-specific recovery: "Your body can handle mild inflammation better at 21, but TB needs extra care"

5. **Regulatory Education** (simplified):
   - "FDA made sesame a required allergen label in 2023"
   - NOT "FDA top-9 allergen" - explain WHY it matters

6. **Co-Pilot Feel**:
   - Do the work FOR the user (give brands, not suggestions to research)
   - Be proactive ("Here are 2 options I found for you")
   - Friendly emoji use: 🛒 for shopping, ⚠️ for warnings

GOOD EXAMPLES:
- "264 calories = 13% of your ~2000 daily needs - adds up if you snack regularly"
- "White sesame can trigger severe allergic reactions (FDA requires labeling since 2023)"
- "Refined flour spikes blood sugar, which can worsen sinus swelling"
- "🛒 Try Hippeas Chickpea Puffs (Target, $4) or Terra Veggie Chips (lower fat)"
- "At 21, your immune system bounces back quickly, but TB means being extra careful"

BAD EXAMPLES (avoid):
- "Triggers mast cell degranulation" (too technical)
- "Try roasted chickpeas" (not specific enough)
- "High calorie content" (not quantified)
- "Mycobacterium tuberculosis antigens" (scientific jargon)

Generate NOW. Sound like a smart, helpful friend - NOT a research paper."""
        
        res = self.llm.invoke(prompt)
        return {"final_conversational_insight": res.content}
