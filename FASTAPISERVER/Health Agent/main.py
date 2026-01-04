import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from workflow import build_health_copilot

load_dotenv()

def main():
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.1,
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )

    app = build_health_copilot(llm)

    inputs = {
        "image_path": "cereal_label.jpg",
        "user_raw_health": "I am managing cardiovascular health and avoid synthetic dyes/ultra-processed additives."
    }

    print("Agentic Co-Pilot is reasoning...")
    result = app.invoke(inputs)
    
    print("\n" + "="*60)
    print(f"ANALYSIS FOR: {result.get('brand_name', 'Unknown')}")
    print("="*60)
    print(result["final_conversational_insight"])
    print("="*60)

if __name__ == "__main__":
    main()