# backend/tasks/agent_runner.py
import asyncio
import logging
from sqlalchemy import select
from backend.database.db import SessionLocal
from backend.database.models.center import Center
from backend.services.redis_service import AsyncRedisClient
from backend.services.gemini import GeminiClient
from backend.services.twilio_service import TwilioClient
from backend.agents.quartermaster import QuartermasterAgent
from backend.agents.soldier import SoldierAgent
from backend.tasks.event_processor import process_redis_events

logger = logging.getLogger(__name__)


async def start_background_agents(specific_center_id: int | None = None) -> None:
    """
    Query all online centers (or just specific_center_id).
    For each: launch QuartermasterAgent.run_poll_loop and
    SoldierAgent.run_report_loop as asyncio tasks.
    Also launch process_redis_events once (if no specific center).
    Called from main.py startup event.
    """
    async with SessionLocal() as db:
        query = select(Center).where(Center.status == "online")
        if specific_center_id:
            query = query.where(Center.id == specific_center_id)
        result = await db.execute(query)
        centers = result.scalars().all()
        center_ids = [c.id for c in centers]

    logger.info("Starting background agents for centers: %s", center_ids)

    for center_id in center_ids:
        redis = AsyncRedisClient()
        gemini = GeminiClient()

        async with SessionLocal() as db:
            qm = QuartermasterAgent(center_id, db, redis, gemini)
            asyncio.create_task(
                qm.run_poll_loop(center_id),
                name=f"quartermaster_{center_id}"
            )

        async with SessionLocal() as db:
            soldier = SoldierAgent(center_id, db, redis, gemini)
            asyncio.create_task(
                soldier.run_report_loop(center_id),
                name=f"soldier_{center_id}"
            )

    if not specific_center_id:
        asyncio.create_task(
            process_redis_events(),
            name="event_processor"
        )