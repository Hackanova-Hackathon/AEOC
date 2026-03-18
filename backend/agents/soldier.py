import asyncio
from sqlalchemy import select, func
from backend.agents.base_agent import BaseAgent
from backend.database.models.vehicle import Vehicle
from backend.database.models.conversation import Conversation
from backend.database.models.agent_log import AgentLog


class SoldierAgent(BaseAgent):
    AGENT_NAME = "Soldier"

    async def report_to_command(self, center_id: int) -> dict:
        """
        Collect center stats, inventory levels, recent agent actions,
        pending extractions count. Publish soldier_report to ws:events.
        """
        center = await self.get_center()
        if not center:
            return {}

        # Count pending extractions (active conversations with high urgency)
        pending_result = await self.db.execute(
            select(func.count()).where(
                Conversation.center_id == center_id,
                Conversation.status == "active",
                Conversation.urgency >= 4,
            )
        )
        pending_count = pending_result.scalar() or 0

        # Count vehicles on mission
        vehicles_result = await self.db.execute(
            select(func.count()).where(
                Vehicle.center_id == center_id,
                Vehicle.status == "on_mission",
            )
        )
        vehicles_on_mission = vehicles_result.scalar() or 0

        # Get last 3 agent actions
        logs_result = await self.db.execute(
            select(AgentLog)
            .where(AgentLog.center_id == center_id)
            .order_by(AgentLog.created_at.desc())
            .limit(3)
        )
        recent_logs = logs_result.scalars().all()

        stats = {
            "center_id": center_id,
            "center_name": center.name,
            "occupied_beds": center.occupied_beds,
            "total_beds": center.total_beds,
            "capacity_percent": round(
                (center.occupied_beds / center.total_beds * 100)
                if center.total_beds else 0, 1
            ),
            "pending_extractions": pending_count,
            "vehicles_on_mission": vehicles_on_mission,
            "status": center.status,
            "recent_actions": [
                {"agent": l.agent_name, "action": l.action_type, "desc": l.description}
                for l in recent_logs
            ],
        }

        await self.log_action(
            self.AGENT_NAME,
            "status_report",
            f"Status report: {center.occupied_beds}/{center.total_beds} beds, {pending_count} pending extractions",
            stats,
        )

        await self.redis.publish("ws:events", {
            "type": "soldier_report",
            "center_id": center_id,
            "stats": stats,
        })

        return stats

    async def run_report_loop(self, center_id: int) -> None:
        """Reports every 10 minutes indefinitely."""
        while True:
            try:
                await self.report_to_command(center_id)
            except Exception as e:
                import logging
                logging.getLogger(__name__).error(
                    "SoldierAgent report error for center %s: %s", center_id, e
                )
            await asyncio.sleep(600)  # 10 minutes