from sqlalchemy import select
from backend.agents.base_agent import BaseAgent
from backend.database.models.center import Center
from backend.database.models.inventory import Inventory


class HealerAgent(BaseAgent):
    AGENT_NAME = "Healer"

    async def check_medical(self, center_id: int, need_description: str) -> dict:
        """
        Check if this center can handle a medical need.
        Checks: doctor_count, nurse_count, paramedic_count, blood units.
        If insufficient, finds best alternative center.
        Returns {can_handle, redirect_center_id, redirect_center_name,
                 redirect_address, blood_available}.
        """
        result = await self.db.execute(
            select(Center).where(Center.id == center_id)
        )
        center = result.scalar_one_or_none()

        if not center:
            return {"can_handle": False, "redirect_center_id": None,
                    "redirect_center_name": None, "redirect_address": None,
                    "blood_available": {}}

        blood_available = {
            "A+": center.blood_units_a_pos,
            "A-": center.blood_units_a_neg,
            "B+": center.blood_units_b_pos,
            "B-": center.blood_units_b_neg,
            "O+": center.blood_units_o_pos,
            "O-": center.blood_units_o_neg,
            "AB+": center.blood_units_ab_pos,
            "AB-": center.blood_units_ab_neg,
        }

        has_doctors = (center.doctor_count or 0) > 0
        has_blood = any(v > 0 for v in blood_available.values())
        can_handle = has_doctors

        if can_handle:
            await self.log_action(
                self.AGENT_NAME,
                "medical_check",
                f"Center {center.name} can handle: {need_description}",
                {"center_id": center_id, "doctors": center.doctor_count},
            )
            return {
                "can_handle": True,
                "redirect_center_id": None,
                "redirect_center_name": None,
                "redirect_address": None,
                "blood_available": blood_available,
            }

        # Find best alternative center
        alt_result = await self.db.execute(
            select(Center)
            .where(
                Center.id != center_id,
                Center.status.in_(["online", "near_full"]),
                Center.doctor_count > 0,
            )
            .order_by(Center.doctor_count.desc())
            .limit(1)
        )
        alt_center = alt_result.scalar_one_or_none()

        redirect_id = alt_center.id if alt_center else None
        redirect_name = alt_center.name if alt_center else None
        redirect_address = alt_center.address if alt_center else None

        await self.log_action(
            self.AGENT_NAME,
            "redirect_medical",
            f"Redirecting medical case from center {center_id} to {redirect_name}",
            {"from_center": center_id, "to_center": redirect_id, "need": need_description},
        )

        return {
            "can_handle": False,
            "redirect_center_id": redirect_id,
            "redirect_center_name": redirect_name,
            "redirect_address": redirect_address,
            "blood_available": blood_available,
        }