import asyncio
from sqlalchemy import select
from backend.agents.base_agent import BaseAgent
from backend.database.models.inventory import Inventory


RESUPPLY_SYSTEM_PROMPT = """You are a disaster relief logistics officer.
Draft a short resupply order message for this low-stock item.
Keep it under 100 characters. Respond with ONLY the order message."""


class QuartermasterAgent(BaseAgent):
    AGENT_NAME = "Quartermaster"

    async def check_supplies(self, center_id: int) -> list[dict]:
        """
        Check inventory for items at or below threshold.
        For each low item: ask Gemini to draft order, log action, publish ws event.
        Returns list of low items.
        """
        result = await self.db.execute(
            select(Inventory).where(
                Inventory.center_id == center_id,
                Inventory.quantity <= Inventory.threshold,
            )
        )
        low_items = result.scalars().all()

        alerts = []
        for item in low_items:
            user_msg = f"Item: {item.item_name}, Current: {item.quantity} {item.unit}, Threshold: {item.threshold} {item.unit}"
            order_msg = await self.gemini.call_gemini(
                RESUPPLY_SYSTEM_PROMPT, user_msg
            )

            await self.log_action(
                self.AGENT_NAME,
                "resupply_requested",
                f"Low stock alert: {item.item_name} at {item.quantity} {item.unit} (threshold: {item.threshold})",
                {
                    "item_id": item.id,
                    "item_name": item.item_name,
                    "quantity": item.quantity,
                    "unit": item.unit,
                    "order_message": order_msg.strip(),
                },
            )

            await self.redis.publish(
                "ws:events",
                {
                    "type": "supply_alert",
                    "center_id": center_id,
                    "item_name": item.item_name,
                    "quantity": item.quantity,
                    "unit": item.unit,
                    "message": order_msg.strip(),
                },
            )
            alerts.append({"item": item.item_name, "quantity": item.quantity})

        return alerts

    async def run_poll_loop(self, center_id: int) -> None:
        """Polls supply levels every 15 minutes indefinitely."""
        while True:
            try:
                await self.check_supplies(center_id)
            except Exception as e:
                import logging
                logging.getLogger(__name__).error(
                    "QuartermasterAgent poll error for center %s: %s", center_id, e
                )
            await asyncio.sleep(900)  # 15 minutes