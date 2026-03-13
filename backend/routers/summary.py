from fastapi import APIRouter
from services.summarizer import generate_summary
from routers.upload import sessions

router = APIRouter()

@router.get("/summary/{session_id}")
def get_summary(session_id: str):
    """
    Generate and return structured meeting summary
    """

    # Check if session exists
    if session_id not in sessions:
        return {"error": "Session not found. Please upload first."}

    # Get classified segments from memory
    classified = sessions[session_id]["classified"]

    # Generate summary using Gemini
    summary = generate_summary(classified)

    return {
        "session_id": session_id,
        "summary": summary
    }