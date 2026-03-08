import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.tts import router as tts_router
from routes.stt import router as stt_router
from routes.translate import router as translate_router

load_dotenv()

app = FastAPI(title="India Duolingo API", version="1.0.0")

# Allow requests from the Vite dev server and any local origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tts_router, prefix="/api")
app.include_router(stt_router, prefix="/api")
app.include_router(translate_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "message": "India Duolingo API is running"}
