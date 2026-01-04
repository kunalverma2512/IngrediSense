from typing import TypedDict, List, Dict, Any

class HealthCoPilotState(TypedDict):
    image_path: str
    user_raw_health: str
    brand_name: str
    ingredients_list: List[str]
    user_clinical_profile: str
    ingredient_knowledge_base: List[Dict[str, Any]]
    clinical_risk_analysis: str
    product_alternatives: List[str]
    final_conversational_insight: str