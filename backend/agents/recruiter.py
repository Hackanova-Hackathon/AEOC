from backend.agents.base_agent import BaseAgent


class RecruiterAgent(BaseAgent):
    AGENT_NAME = "Recruiter"

    async def check_staff_levels(self, center_id: int) -> list[dict]:
        """
        Check:
        1. Staff-to-patient ratio (< 0.05 = understaffed)
        2. Blood type shortages (any type at 0)
        Logs alerts and publishes ws events for each issue found.
        Returns list of alert dicts.
        """
        center = await self.get_center()
        if not center:
            return []

        alerts = []

        # Check staff ratio
        total_medical = (
            (center.doctor_count or 0)
            + (center.nurse_count or 0)
            + (center.paramedic_count or 0)
        )
        occupied = center.occupied_beds or 0

        if occupied > 0:
            ratio = total_medical / occupied
            if ratio < 0.05:
                msg = f"Staff shortage at {center.name}"
                await self.log_action(
                    self.AGENT_NAME,
                    "understaffed",
                    f"Staff ratio {ratio:.3f} below threshold 0.05 ({total_medical} staff / {occupied} patients)",
                    {
                        "center_id": center_id,
                        "ratio": round(ratio, 4),
                        "total_medical": total_medical,
                        "occupied": occupied,
                    },
                )
                await self.redis.publish("ws:events", {
                    "type": "alert",
                    "center_id": center_id,
                    "message": msg,
                    "severity": "warning",
                })
                alerts.append({"type": "understaffed", "message": msg})

        # Check blood unit shortages
        blood_fields = {
            "A+": center.blood_units_a_pos,
            "A-": center.blood_units_a_neg,
            "B+": center.blood_units_b_pos,
            "B-": center.blood_units_b_neg,
            "O+": center.blood_units_o_pos,
            "O-": center.blood_units_o_neg,
            "AB+": center.blood_units_ab_pos,
            "AB-": center.blood_units_ab_neg,
        }

        for blood_type, units in blood_fields.items():
            if (units or 0) == 0:
                msg = f"Blood shortage at {center.name}: {blood_type} depleted"
                await self.log_action(
                    self.AGENT_NAME,
                    "blood_shortage",
                    f"Blood type {blood_type} is at 0 units",
                    {"center_id": center_id, "blood_type": blood_type},
                )
                await self.redis.publish("ws:events", {
                    "type": "alert",
                    "center_id": center_id,
                    "message": f"Blood shortage at {center.name}",
                    "blood_type": blood_type,
                    "severity": "critical",
                })
                alerts.append({"type": "blood_shortage", "blood_type": blood_type, "message": msg})

        return alerts