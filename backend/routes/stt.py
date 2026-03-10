import os
import io
import asyncio
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from sarvamai import SarvamAI

router = APIRouter()

TIMEOUT_SECONDS = 30


@router.post("/stt")
async def speech_to_text(
    audio_file: UploadFile = File(...),
    language_code: str = Form(default="hi-IN"),
):
    """Transcribe audio using Sarvam saarika."""
    client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY"))
    try:
        audio_bytes = await audio_file.read()
        audio_stream = io.BytesIO(audio_bytes)
        # Use the uploaded filename so the SDK can infer the audio codec.
        # The frontend sets the correct extension (webm/ogg/mp4) per device.
        audio_stream.name = audio_file.filename or "audio.webm"

        response = await asyncio.wait_for(
            asyncio.get_event_loop().run_in_executor(
                None,
                lambda: client.speech_to_text.transcribe(
                    file=audio_stream,
                    language_code=language_code,
                ),
            ),
            timeout=TIMEOUT_SECONDS,
        )
        return {"transcript": response.transcript}
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Speech recognition timed out. Please try again.")
    except Exception as e:
        msg = str(e)
        import re
        match = re.search(r"'message':\s*'([^']+)'", msg)
        raise HTTPException(status_code=500, detail=match.group(1) if match else "Speech recognition failed.")
