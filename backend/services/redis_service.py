import json
from typing import AsyncGenerator
import redis.asyncio as aioredis
from backend.config import settings


class AsyncRedisClient:
    def __init__(self):
        self.redis = aioredis.from_url(
            settings.REDIS_URL, encoding="utf-8", decode_responses=True
        )

    async def publish(self, channel: str, data_dict: dict) -> None:
        """Publish a dict as JSON to a Redis channel."""
        payload = json.dumps(data_dict, default=str)
        await self.redis.publish(channel, payload)

    async def subscribe(self, channel: str) -> AsyncGenerator[dict, None]:
        """Subscribe to a channel and yield parsed dicts."""
        pubsub = self.redis.pubsub()
        await pubsub.subscribe(channel)
        async for raw_message in pubsub.listen():
            if raw_message["type"] == "message":
                try:
                    yield json.loads(raw_message["data"])
                except json.JSONDecodeError:
                    yield {"raw": raw_message["data"]}

    async def get(self, key: str) -> str | None:
        return await self.redis.get(key)

    async def set(self, key: str, value: str, ttl: int | None = None) -> None:
        if ttl:
            await self.redis.setex(key, ttl, value)
        else:
            await self.redis.set(key, value)

    async def delete(self, key: str) -> None:
        await self.redis.delete(key)

    async def close(self) -> None:
        await self.redis.close()