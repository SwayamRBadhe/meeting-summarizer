from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, summary, chat, metrics

app = FastAPI(title="AI Meeting Summarizer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router,  prefix="/api")
app.include_router(summary.router, prefix="/api")
app.include_router(chat.router,    prefix="/api")
app.include_router(metrics.router, prefix="/api")

@app.get("/")
def home():
    return {"message": "AI Meeting Summarizer is running!"}