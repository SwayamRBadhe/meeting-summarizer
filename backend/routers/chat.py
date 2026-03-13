from fastapi import APIRouter
from services.chat_service import chat_with_transcript
from models.schemas import ChatRequest
from routers.upload import sessions

router = APIRouter()

@router.post("/chat")
def chat(request: ChatRequest):
    """
    Answer user question about the meeting
    using RAG pipeline
    """

    # Check if session exists
    if request.session_id not in sessions:
        return {"error": "Session not found. Please upload first."}

    # Get answer using RAG
    answer = chat_with_transcript(
        request.session_id,
        request.question
    )

    return {
        "session_id": request.session_id,
        "question": request.question,
        "answer": answer
    }