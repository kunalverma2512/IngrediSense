import os
import cv2
import json
import requests
import pytesseract
from bs4 import BeautifulSoup
from typing import List
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from rich import print as rprint
from rich.panel import Panel
from rich.table import Table

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


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
        self.label_llm = llm.with_structured_output(LabelExtraction)
        self.profile_llm = llm.with_structured_output(IngredientProfile)

    def extract_label_data(self, image_path: str) -> LabelExtraction:
        image = cv2.imread(image_path)
        if image is None:
            return LabelExtraction(brand="Unknown", ingredients=[])
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        raw_text = pytesseract.image_to_string(gray)
        prompt = f"""
        You are a high-precision OCR and label parser.
        TEXT:
        {raw_text}
        Identify the product brand and extract only the ingredient list.
        """
        return self.label_llm.invoke(prompt)

    def fetch_clinical_evidence(self, ingredient: str) -> IngredientProfile:
        wiki_text = ""
        off_data = {}

        try:
            wiki_url = f"https://en.wikipedia.org/wiki/{ingredient.replace(' ', '_')}"
            soup = BeautifulSoup(requests.get(wiki_url, timeout=5).text, "html.parser")
            wiki_text = " ".join(p.text for p in soup.select("p")[:3])
        except:
            pass

        try:
            off_url = f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={ingredient}&json=1"
            off_data = requests.get(off_url, timeout=5).json().get("products", [{}])[0]
        except:
            pass

        regulatory_map = {
            "titanium dioxide": "Banned in EU (E171), permitted in USA",
            "red 40": "Warning labels required in some regions",
            "potassium bromate": "Banned in UK/EU/Canada due to carcinogenic risk",
            "bha": "Classified by NIH as reasonably anticipated human carcinogen"
        }

        reg_status = next(
            (v for k, v in regulatory_map.items() if k in ingredient.lower()),
            "No major regulatory restrictions identified"
        )

        prompt = f"""
        You are a clinical nutrition and food safety researcher.
        Ingredient: {ingredient}
        Scientific context: {wiki_text}
        OpenFoodFacts data: {json.dumps(off_data)}
        Regulatory context: {reg_status}
        Provide a concise health and processing assessment.
        """
        return self.profile_llm.invoke(prompt)

    def find_better_alternatives(self, brand: str, ingredients: List[str]) -> List[str]:
        search_term = brand if brand != "Unknown" else ingredients[0] if ingredients else "Organic"
        try:
            url = f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={search_term}&nova_group=1&json=1"
            data = requests.get(url, timeout=5).json()
            return [p.get("product_name") for p in data.get("products", [])[:2]]
        except:
            return []


if __name__ == "__main__":
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.1,
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )

    tools = ProHealthTools(llm)

    label = tools.extract_label_data("sample.jpg")
    rprint(
        Panel(
            f"[bold cyan]Brand:[/bold cyan] {label.brand}\n\n"
            f"[bold yellow]Ingredients:[/bold yellow]\n" + "\n".join(label.ingredients),
            title="Label Extraction"
        )
    )

    table = Table(title="Ingredient Health Profiles")
    table.add_column("Ingredient")
    table.add_column("Manufacturing")
    table.add_column("Regulatory Status")
    table.add_column("Health Risks")
    table.add_column("NOVA")

    profiles = [tools.fetch_clinical_evidence(i) for i in label.ingredients]
    for p in profiles:
        table.add_row(
            p.name,
            p.manufacturing,
            p.regulatory_gap,
            p.health_risks,
            str(p.nova_score)
        )

    rprint(table)

    alternatives = tools.find_better_alternatives(label.brand, label.ingredients)
    rprint(Panel("\n".join(alternatives), title="Lower-Processed Alternatives", style="green"))
