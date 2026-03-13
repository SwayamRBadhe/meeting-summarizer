from pydantic import BaseModel

# What the chat request looks like
class ChatRequest(BaseModel):
    session_id: str
    question: str

# What the upload response looks like
class UploadResponse(BaseModel):
    session_id: str
    segment_count: int
    message: str