from state import HealthCoPilotState
from tools import ProHealthTools
from langchain_google_genai import ChatGoogleGenerativeAI

class AgentNodes:
    def __init__(self, llm: ChatGoogleGenerativeAI):
        self.llm = llm
        self.tools = ProHealthTools(llm)

    def extractor_node(self, state: HealthCoPilotState):
        data = self.tools.extract_label_data(state["image_path"])
        return {"brand_name": data["brand"], "ingredients_list": data["ingredients"]}

    def health_profiler_node(self, state: HealthCoPilotState):
        prompt = f"""
        SYSTEM: Clinical Health Profiler.
        INPUT: {state['user_raw_health']}
        TASK: Convert user symptoms or diseases into precise bio-chemical triggers (e.g., 'Hypertension' -> 'Sodium/Vasoconstrictors').
        """
        res = self.llm.invoke(prompt)
        return {"user_clinical_profile": res.content}

    def researcher_node(self, state: HealthCoPilotState):
        knowledge = [self.tools.fetch_clinical_evidence(i) for i in state["ingredients_list"][:10]]
        alternatives = self.tools.find_better_alternatives(state["brand_name"], state["ingredients_list"])
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
        prompt = f"""
        SYSTEM: AI-Native Health Interface.
        BRAND: {state['brand_name']}
        RISKS: {state['clinical_risk_analysis']}
        ALTS: {state['product_alternatives']}
        TASK: Generate a friendly, expert response.
        STRUCTURE:
        - SIGNAL: [🟢 SAFE], [🟡 CAUTION], or [🔴 WARNING]
        - CORE INSIGHT: One sentence on why this matters to the user.
        - THE WHY: Explanation of the manufacturing trade-off or regulatory gap.
        - SUGGESTION: Mention a healthier alternative if risks are found.
        - HONESTY: Mention if data is limited.
        """
        res = self.llm.invoke(prompt)
        return {"final_conversational_insight": res.content}