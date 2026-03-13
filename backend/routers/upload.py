import os
# Tell Whisper where ffmpeg is on Windows
os.environ["PATH"] += os.pathsep + r"C:\ProgramData\chocolatey\bin"
from fastapi import APIRouter, UploadFile, File, Form
from services.preprocessing import clean_text
from services.ml_classifier import classify_segments
from services.vector_store import store_in_chromadb
import uuid


router = APIRouter()

# Store session data in memory
sessions = {}

@router.post("/upload")
async def upload_meeting(
    file: UploadFile = File(None),
    transcript: str = Form(None)
):
    """
    Accept audio file OR plain text transcript
    Process it and store in ChromaDB
    """

    # Step 1 - Get raw text
    if file:
        # Save uploaded file temporarily
        upload_dir = "./uploads"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = f"{upload_dir}/{file.filename}"
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        # Transcribe audio using Whisper
        import whisper
        whisper_model = whisper.load_model("base")
        result = whisper_model.transcribe(file_path)
        raw_text = result["text"]

    elif transcript:
        # Use pasted text directly
        raw_text = transcript

    else:
        return {"error": "Please provide audio file or transcript"}

    # Step 2 - Clean text
    sentences = clean_text(raw_text)

    # Step 3 - Classify segments
    classified = classify_segments(sentences)

    # Step 4 - Store in ChromaDB
    session_id = str(uuid.uuid4())
    store_in_chromadb(session_id, sentences, classified)

    # Step 5 - Save to memory
    sessions[session_id] = {
        "raw": raw_text,
        "sentences": sentences,
        "classified": classified
    }

    return {
        "session_id": session_id,
        "segment_count": len(sentences),
        "message": "Upload successful"
    }