import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sarvamai import SarvamAI

router = APIRouter()


class TTSRequest(BaseModel):
    text: str
    language_code: str = "hi-IN"
    speaker: str = "anushka"
    pace: float = 1.0
    temperature: float = 0.6


@router.post("/tts")
async def text_to_speech(req: TTSRequest):
    """Convert text to speech using Sarvam bulbul:v3."""
    client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY"))
    try:
        response = client.text_to_speech.convert(
            text=req.text,
            target_language_code=req.language_code,
            speaker=req.speaker,
            pace=req.pace,
            temperature=req.temperature,
            model="bulbul:v3",
        )
        # response.audios[0] is already a base64-encoded string
        return {"audio_base64": response.audios[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
