#this is the main file for the backend server. its basically a start point of the backend

from fastapi import FastAPI 
#fast api is a python framework for building api's. it is a modern, fast, web framework for building api's in python. its basicallt a foundation of backend api.
 
from fastapi.middleware.cors import CORSMiddleware
#so basically we install middleware from fast api. which is cors middleware. which is used to allow cross origin requests. which is used to allow the frontend to talk to the backend. basically browser blocks the request from port 3000 to port 8000 and vice versa. so we need to allow the request from port 3000 to port 8000. which is cors middleware. cors removes the restriction of the browser. 

from routers import upload, summary, chat, metrics

app = FastAPI(title="AI Meeting Summarizer") #this appears into the title of the browser tab

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#above code basically tells the middleware to allow request from port 3000. all type of reuest such as post/put/get/delete etc. and all type of headers such as content-type, authorization, etc. 

app.include_router(upload.router,  prefix="/api")
app.include_router(summary.router, prefix="/api")
app.include_router(chat.router,    prefix="/api")
app.include_router(metrics.router, prefix="/api")

#this are the 4 routers which are basically 4 endpoints which start from /api/... 

@app.get("/")
def home():
    return {"message": "AI Meeting Summarizer is running!"}

#above is basically a simple test route. stating this is the default message when the backend is running.




