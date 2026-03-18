from fastapi import APIRouter, Request, Depends
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database.db import get_db
from backend.services.redis_service import AsyncRedisClient
from backend.services.gemini import GeminiClient
from backend.services.twilio_service import TwilioClient
from backend.agents.liaison import LiaisonAgent

router = APIRouter(prefix="/webhook", tags=["webhook"])

TWIML_EMPTY = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>'


@router.post("/twilio/whatsapp")
async def twilio_whatsapp_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Twilio sends form-encoded POST with:
    - From: 'whatsapp:+919876543210'
    - Body: message text
    
    We must return TwiML <Response></Response> or Twilio will retry.
    """
    form = await request.form()
    from_raw = form.get("From", "")
    body = form.get("Body", "").strip()

    # Strip 'whatsapp:' prefix if present
    from_number = from_raw.replace("whatsapp:", "")

    if from_number and body:
        redis_client = AsyncRedisClient()
        gemini_client = GeminiClient()
        twilio_client = TwilioClient()

        # Use center_id=1 as default; Liaison will reassign based on capacity
        agent = LiaisonAgent(
            center_id=1,
            db=db,
            redis_client=redis_client,
            gemini_client=gemini_client,
            twilio_client=twilio_client,
        )
        try:
            await agent.process_message(from_number, body)
        except Exception as e:
            import logging
            logging.getLogger(__name__).error("Webhook error: %s", e)
        finally:
            await redis_client.close()

    # Always return empty TwiML — required by Twilio to prevent retries
    return Response(content=TWIML_EMPTY, media_type="application/xml")