import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from services.vector_store import search_chromadb
from dotenv import load_dotenv

# Load API key
load_dotenv()

# Initialize Gemini model
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.3
)

def chat_with_transcript(session_id: str, question: str):
    """
    Answer user question based on transcript context
    This is the RAG in action:
    1. Search relevant segments from ChromaDB
    2. Send context + question to Gemini
    3. Return answer
    """

    # Step 1 - Retrieve relevant segments
    relevant_segments = search_chromadb(session_id, question)

    # Step 2 - Format context
    context = "\n".join(relevant_segments)

    # Step 3 - Build prompt
    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""
You are a helpful meeting assistant.
Answer the question based ONLY on the 
meeting transcript context below.
If the answer is not in the context,
say "I could not find that in the meeting."

Context from meeting:
{context}

Question: {question}

Answer:
"""
    )

    # Step 4 - Send to Gemini
    chain = prompt | llm
    response = chain.invoke({
        "context": context,
        "question": question
    })

    return response.content