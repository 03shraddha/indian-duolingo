import os
import asyncio
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sarvamai import SarvamAI

router = APIRouter()

# Default TTS speaker per language (bulbul:v3, 45 speakers).
LANGUAGE_SPEAKERS: dict[str, str] = {
    "hi-IN": "priya",
    "kn-IN": "priya",
    "ta-IN": "ritu",
    "te-IN": "neha",
    "bn-IN": "kavitha",
    "mr-IN": "priya",
}

TIMEOUT_SECONDS = 30


class TTSRequest(BaseModel):
    text: str
    language_code: str = "hi-IN"
    speaker: Optional[str] = None
    pace: float = 1.0


@router.post("/tts")
async def text_to_speech(req: TTSRequest):
    """Convert text to speech using Sarvam bulbul:v3."""
    client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY"))
    speaker = req.speaker or LANGUAGE_SPEAKERS.get(req.language_code, "aditya")
    try:
        response = await asyncio.wait_for(
            asyncio.get_event_loop().run_in_executor(
                None,
                lambda: client.text_to_speech.convert(
                    text=req.text,
                    target_language_code=req.language_code,
                    speaker=speaker,
                    pace=req.pace,
                    model="bulbul:v3",
                ),
            ),
            timeout=TIMEOUT_SECONDS,
        )
        return {"audio_base64": response.audios[0]}
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Audio generation timed out. Please try again.")
    except Exception as e:
        msg = str(e)
        # Extract human-readable message from verbose SDK exceptions
        import re
        match = re.search(r"'message':\s*'([^']+)'", msg)
        raise HTTPException(status_code=500, detail=match.group(1) if match else "Audio generation failed.")
