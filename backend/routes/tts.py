import os
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sarvamai import SarvamAI

router = APIRouter()

# Default TTS speaker per language (bulbul:v3, 45 speakers).
# All speakers: aditya, shubh, rahul, rohan, ritu, priya, neha, pooja, kavitha, anushka, etc.
LANGUAGE_SPEAKERS: dict[str, str] = {
    "hi-IN": "priya",     # female Hindi voice (bulbul:v3)
    "kn-IN": "priya",     # female, Kannada
    "ta-IN": "ritu",      # female, Tamil
    "te-IN": "neha",      # female, Telugu
    "bn-IN": "kavitha",   # female, Bengali
    "mr-IN": "priya",     # female, Marathi (shares Devanagari with Hindi)
}


class TTSRequest(BaseModel):
    text: str
    language_code: str = "hi-IN"
    speaker: Optional[str] = None   # if omitted, use language default
    pace: float = 1.0


@router.post("/tts")
async def text_to_speech(req: TTSRequest):
    """Convert text to speech using Sarvam bulbul:v3."""
    client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY"))
    try:
        speaker = req.speaker or LANGUAGE_SPEAKERS.get(req.language_code, "aditya")
        response = client.text_to_speech.convert(
            text=req.text,
            target_language_code=req.language_code,
            speaker=speaker,
            pace=req.pace,
            model="bulbul:v3",
        )
        # response.audios[0] is base64-encoded WAV
        return {"audio_base64": response.audios[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
