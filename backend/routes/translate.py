import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sarvamai import SarvamAI

router = APIRouter()


class TranslateRequest(BaseModel):
    text: str
    source_language_code: str = "en-IN"
    target_language_code: str = "hi-IN"


@router.post("/translate")
async def translate_text(req: TranslateRequest):
    """Translate text using Sarvam mayura:v1."""
    client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY"))
    try:
        response = client.text.translate(
            input=req.text,
            source_language_code=req.source_language_code,
            target_language_code=req.target_language_code,
        )
        return {"translated_text": response.translated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
