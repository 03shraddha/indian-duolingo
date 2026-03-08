import os
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sarvamai import SarvamAI

router = APIRouter()

# Default TTS speaker per language (bulbul:v3, 45 speakers).
# Confirmed valid: anushka, kavitha, priya, neha, rahul, pooja, aditya, shubh, ritu, and more.
LANGUAGE_SPEAKERS: dict[str, str] = {
    "hi-IN": "anushka",   # warm, clear Hindi voice
    "kn-IN": "kavitha",   # female, works well for Kannada
    "ta-IN": "kavitha",   # female, works well for Tamil
    "te-IN": "kavitha",   # female, works well for Telugu
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
        speaker = req.speaker or LANGUAGE_SPEAKERS.get(req.language_code, "kavitha")
        response = client.text_to_speech.convert(
            text=req.text,
            target_language_code=req.language_code,
            speaker=speaker,
            pace=req.pace,
            model="bulbul:v3",
        )
        # response.audios[0] is already a base64-encoded string
        return {"audio_base64": response.audios[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
