import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

# Load API key
load_dotenv()

# Initialize Gemini model
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.3
)

def generate_summary(classified: list):
    """
    Send classified segments to Gemini
    and get a structured meeting summary
    """

    # Format segments for the prompt
    segments_text = ""
    for item in classified:
        segments_text += f"[{item['label']}] {item['text']}\n"

    # Prompt template
    prompt = PromptTemplate(
        input_variables=["segments"],
        template="""
You are a professional meeting summarizer.
Based on the following classified meeting segments,
generate a clean structured summary.

Meeting Segments:
{segments}

Generate the following:
1. Executive Summary (3-5 sentences)
2. Key Decisions
3. Action Items (with owner if mentioned)
4. Follow-up Questions

Keep it concise and professional.
"""
    )

    # Send to Gemini
    chain = prompt | llm
    response = chain.invoke({"segments": segments_text})

    return response.content