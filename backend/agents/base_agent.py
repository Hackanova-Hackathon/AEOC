from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.database.models.agent_log import AgentLog
from backend.database.models.center import Center
from backend.services.redis_service import AsyncRedisClient
from backend.services.gemini import GeminiClient
from backend.services.twilio_service import TwilioClient


class BaseAgent:
    def __init__(
        self,
        center_id: int,
        db: AsyncSession,
        redis_client: AsyncRedisClient,
        gemini_client: GeminiClient,
        twilio_client: TwilioClient | None = None,
    ):
        self.center_id = center_id
        self.db = db
        self.redis = redis_client
        self.gemini = gemini_client
        self.twilio = twilio_client

    async def log_action(
        self,
        agent_name: str,
        action_type: str,
        description: str,
        metadata: dict = {},
    ) -> AgentLog:
        """Save AgentLog to DB and publish ws:events."""
        log = AgentLog(
            center_id=self.center_id,
            agent_name=agent_name,
            action_type=action_type,
            description=description,
            metadata=metadata,
        )
        self.db.add(log)
        await self.db.commit()
        await self.db.refresh(log)

        await self.redis.publish(
            "ws:events",
            {
                "type": "agent_log",
                "center_id": self.center_id,
                "agent_name": agent_name,
                "action_type": action_type,
                "description": description,
                "created_at": log.created_at.isoformat(),
            },
        )
        return log

    async def get_center(self) -> Center | None:
        """Fetch the center row for this agent's center_id."""
        result = await self.db.execute(
            select(Center).where(Center.id == self.center_id)
        )
        return result.scalar_one_or_none()