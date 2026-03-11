import os
import asyncio
import base64
import json
import re
from typing import Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sarvamai import SarvamAI
import httpx

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
SARVAM_BASE = "https://api.sarvam.ai"


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
        match = re.search(r"'message':\s*'([^']+)'", msg)
        raise HTTPException(status_code=500, detail=match.group(1) if match else "Audio generation failed.")


@router.post("/tts/stream")
async def tts_stream(req: TTSRequest):
    """
    Stream TTS audio as MP3 bytes — playback begins as soon as the first chunk arrives.

    Calls the Sarvam streaming endpoint, which starts sending audio before it finishes
    synthesising the full phrase. The frontend uses MediaSource to play chunks in real time.
    """
    api_key = os.getenv("SARVAM_API_KEY")
    speaker = req.speaker or LANGUAGE_SPEAKERS.get(req.language_code, "aditya")

    # Open connection and check status BEFORE starting the StreamingResponse,
    # so we can still raise a proper HTTPException on error.
    client = httpx.AsyncClient(timeout=httpx.Timeout(connect=10.0, read=30.0, write=10.0, pool=5.0))
    try:
        sarvam_req = client.build_request(
            "POST",
            f"{SARVAM_BASE}/text-to-speech/stream",
            headers={"api-subscription-key": api_key},
            json={
                "inputs": [req.text],
                "target_language_code": req.language_code,
                "speaker": speaker,
                "pace": req.pace,
                "model": "bulbul:v3",
                "output_audio_codec": "mp3",
            },
        )
        sarvam_resp = await client.send(sarvam_req, stream=True)
    except Exception as e:
        await client.aclose()
        raise HTTPException(status_code=502, detail=f"Failed to reach Sarvam: {e}")

    if sarvam_resp.status_code != 200:
        error_body = await sarvam_resp.aread()
        await sarvam_resp.aclose()
        await client.aclose()
        try:
            detail = json.loads(error_body).get("message", error_body.decode())
        except Exception:
            detail = error_body.decode() or "Sarvam streaming failed"
        raise HTTPException(status_code=sarvam_resp.status_code, detail=detail)

    content_type = sarvam_resp.headers.get("content-type", "")
    is_json_stream = "json" in content_type or "text/" in content_type

    async def generate():
        try:
            if is_json_stream:
                # Sarvam returns NDJSON lines: {"audio": "<base64_mp3>", ...}
                # Decode each line and yield raw MP3 bytes.
                async for line in sarvam_resp.aiter_lines():
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        data = json.loads(line)
                        if "audio" in data:
                            yield base64.b64decode(data["audio"])
                    except Exception:
                        pass  # skip malformed lines
            else:
                # Raw audio bytes — proxy directly
                async for chunk in sarvam_resp.aiter_bytes(chunk_size=4096):
                    yield chunk
        finally:
            await sarvam_resp.aclose()
            await client.aclose()

    return StreamingResponse(
        generate(),
        media_type="audio/mpeg",
        headers={"Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff"},
    )
