from typing import TypedDict, List, Dict, Any, Optional

class HealthCoPilotState(TypedDict):
    image_path: str
    user_raw_health: str
    brand_name: str
    ingredients_list: List[str]
    nutrition_facts: Optional[Dict[str, Any]]  # Nutrition data from label
    user_clinical_profile: str
    ingredient_knowledge_base: List[Dict[str, Any]]
    clinical_risk_analysis: str
    product_alternatives: List[str]
    final_conversational_insight: str
    decision_color: Optional[str]  # Hex color for Quick Decision (green/yellow/red)

