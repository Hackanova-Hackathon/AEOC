import logging
from backend.database.db import SessionLocal
from backend.services.redis_service import AsyncRedisClient
from backend.services.gemini import GeminiClient
from backend.services.twilio_service import TwilioClient
from backend.agents.liaison import LiaisonAgent

logger = logging.getLogger(__name__)


async def process_redis_events() -> None:
    """
    Subscribe to Redis 'whatsapp:inbound' channel.
    For each event: init DB session + clients + LiaisonAgent,
    then call process_message(from_number, body).
    """
    redis_client = AsyncRedisClient()
    logger.info("event_processor: Subscribing to whatsapp:inbound")

    try:
        async for event in redis_client.subscribe("whatsapp:inbound"):
            from_number = event.get("from_number")
            body = event.get("body")

            if not from_number or not body:
                logger.warning("event_processor: Skipping malformed event: %s", event)
                continue

            logger.info("event_processor: Processing message from %s", from_number)

            async with SessionLocal() as db:
                gemini = GeminiClient()
                twilio = TwilioClient()
                agent = LiaisonAgent(
                    center_id=1,
                    db=db,
                    redis_client=redis_client,
                    gemini_client=gemini,
                    twilio_client=twilio,
                )
                try:
                    await agent.process_message(from_number, body)
                except Exception as e:
                    logger.error(
                        "event_processor: Error handling message from %s: %s",
                        from_number, e
                    )
    except Exception as e:
        logger.error("event_processor: Fatal error: %s", e)
    finally:
        await redis_client.close()