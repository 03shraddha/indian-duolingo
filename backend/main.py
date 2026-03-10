import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.tts import router as tts_router
from routes.stt import router as stt_router

load_dotenv()

app = FastAPI(title="India Duolingo API", version="1.0.0")

# FRONTEND_URL: set this env var to your Vercel deployment URL in production
# e.g. https://india-duolingo.vercel.app
_frontend_url = os.getenv("FRONTEND_URL", "")
_allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]
if _frontend_url:
    _allowed_origins.append(_frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tts_router, prefix="/api")
app.include_router(stt_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "message": "India Duolingo API is running"}
