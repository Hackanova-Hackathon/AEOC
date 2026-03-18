from sqlalchemy import select
from backend.agents.base_agent import BaseAgent
from backend.database.models.inventory import Inventory
from backend.database.models.agent_log import AgentLog
from backend.database.models.sitrep import Sitrep


SITREP_SYSTEM_PROMPT = """You are a disaster relief operations reporter.
Generate a professional Situation Report (SITREP) with exactly these sections:
SITUATION: Current status of the relief center
RESOURCES: Available beds, medical staff, supplies, vehicles
ACTIONS TAKEN: Recent agent actions and outcomes
IMMEDIATE NEEDS: Urgent requirements
OUTLOOK: Next 4-6 hour forecast

Be concise, use numbers where possible. Total length: 200-300 words."""


class ReporterAgent(BaseAgent):
    AGENT_NAME = "Reporter"

    async def generate_sitrep(self, center_id: int) -> Sitrep:
        """
        Fetch all center data, build context, call Gemini for SITREP,
        save to DB, publish ws event, return sitrep object.
        """
        center = await self.get_center()
        if not center:
            raise ValueError(f"Center {center_id} not found")

        # Fetch inventory
        inv_result = await self.db.execute(
            select(Inventory).where(Inventory.center_id == center_id)
        )
        inventory = inv_result.scalars().all()

        # Fetch recent agent logs (last 10)
        log_result = await self.db.execute(
            select(AgentLog)
            .where(AgentLog.center_id == center_id)
            .order_by(AgentLog.created_at.desc())
            .limit(10)
        )
        recent_logs = log_result.scalars().all()

        # Build context string
        inventory_text = "\n".join(
            f"  - {i.item_name}: {i.quantity} {i.unit} (threshold: {i.threshold})"
            for i in inventory
        ) or "  No inventory data"

        logs_text = "\n".join(
            f"  [{l.created_at.strftime('%H:%M')}] {l.agent_name}: {l.description}"
            for l in recent_logs
        ) or "  No recent activity"

        context = f"""Center: {center.name}
Location: {center.address}
Status: {center.status}
Beds: {center.occupied_beds}/{center.total_beds} occupied
Medical Staff: {center.doctor_count} doctors, {center.nurse_count} nurses, {center.paramedic_count} paramedics
Blood Bank: {'Available' if center.has_blood_bank else 'Not available'}

Inventory:
{inventory_text}

Recent Actions:
{logs_text}"""

        sitrep_content = await self.gemini.call_gemini(
            SITREP_SYSTEM_PROMPT, context
        )
        if isinstance(sitrep_content, dict):
            sitrep_content = str(sitrep_content)

        sitrep = Sitrep(
            center_id=center_id,
            content=sitrep_content.strip(),
            generated_by="agent",
        )
        self.db.add(sitrep)
        await self.db.commit()
        await self.db.refresh(sitrep)

        await self.log_action(
            self.AGENT_NAME,
            "sitrep_generated",
            f"Generated SITREP for {center.name}",
            {"sitrep_id": sitrep.id},
        )

        await self.redis.publish("ws:events", {
            "type": "sitrep_generated",
            "center_id": center_id,
            "sitrep_id": sitrep.id,
            "center_name": center.name,
        })

        return sitrep