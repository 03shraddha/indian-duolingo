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
        # Use the uploaded filename so Sarvam SDK can infer the audio codec.
        # The frontend sets a correct extension (webm, mp4, ogg) based on
        # MediaRecorder.mimeType so this will be right per device.
        audio_stream.name = audio_file.filename or "audio.webm"

        response = client.speech_to_text.transcribe(
            file=audio_stream,
            language_code=language_code,
        )
        return {"transcript": response.transcript}
    except Exception as e:
        # Extract only the human-readable part from verbose SDK exceptions.
        # The SDK str(e) can include raw HTTP headers and response bodies.
        msg = str(e)
        # Try to pull out the Sarvam error message field if present
        import re
        match = re.search(r"'message':\s*'([^']+)'", msg)
        clean = match.group(1) if match else "Speech recognition failed."
        raise HTTPException(status_code=500, detail=clean)
