import os
import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from sarvamai import SarvamAI

router = APIRouter()


@router.post("/stt")
async def speech_to_text(
    audio_file: UploadFile = File(...),
    language_code: str = Form(default="hi-IN"),
):
    """Transcribe audio using Sarvam saarika:v2.5."""
    client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY"))
    try:
        audio_bytes = await audio_file.read()
        # Wrap bytes in a file-like object so the SDK can read it
        audio_stream = io.BytesIO(audio_bytes)
        audio_stream.name = audio_file.filename or "audio.webm"

        response = client.speech_to_text.transcribe(
            file=audio_stream,
            language_code=language_code,
        )
        return {"transcript": response.transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
