from langgraph.graph import StateGraph, END
from state import HealthCoPilotState
from nodes import AgentNodes
from langchain_google_genai import ChatGoogleGenerativeAI

def build_health_copilot(llm: ChatGoogleGenerativeAI):
    nodes = AgentNodes(llm)
    workflow = StateGraph(HealthCoPilotState)

    workflow.add_node("extract", nodes.extractor_node)
    workflow.add_node("profile", nodes.health_profiler_node)
    workflow.add_node("research", nodes.researcher_node)
    workflow.add_node("analyze", nodes.risk_analyzer_node)
    workflow.add_node("design", nodes.conversational_designer_node)

    workflow.set_entry_point("extract")
    workflow.add_edge("extract", "profile")
    workflow.add_edge("profile", "research")
    workflow.add_edge("research", "analyze")
    workflow.add_edge("analyze", "design")
    workflow.add_edge("design", END)

    return workflow.compile()