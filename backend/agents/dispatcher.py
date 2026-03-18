from sqlalchemy import select
from backend.agents.base_agent import BaseAgent
from backend.database.models.vehicle import Vehicle


TYPE_PRIORITY = {"ambulance": 0, "bus": 1, "truck": 2}


class DispatcherAgent(BaseAgent):
    AGENT_NAME = "Dispatcher"

    async def assign_vehicle(
        self,
        center_id: int,
        task_type: str,
        destination_lat: float,
        destination_lng: float,
    ) -> dict | None:
        """
        Find best idle vehicle at center_id.
        Priority for extraction: ambulance > bus > truck.
        Updates vehicle status, logs action, publishes ws event.
        Returns {vehicle_id, eta_minutes, registration} or None.
        """
        result = await self.db.execute(
            select(Vehicle).where(
                Vehicle.center_id == center_id,
                Vehicle.status == "idle",
            )
        )
        vehicles = result.scalars().all()

        if not vehicles:
            await self.log_action(
                self.AGENT_NAME,
                "no_vehicle",
                f"No idle vehicles available at center {center_id} for {task_type}",
            )
            return None

        # Sort by type priority
        vehicles_sorted = sorted(
            vehicles, key=lambda v: TYPE_PRIORITY.get(v.vehicle_type, 99)
        )
        chosen = vehicles_sorted[0]

        task_description = f"{task_type} to ({destination_lat:.4f}, {destination_lng:.4f})"
        chosen.status = "on_mission"
        chosen.current_task = task_description
        await self.db.commit()

        # Calculate ETA
        center = await self.get_center()
        eta_minutes = 15  # default
        if center:
            from backend.services.gmaps_service import GMapsClient
            gmaps = GMapsClient()
            try:
                dist = await gmaps.distance_matrix(
                    center.lat, center.lng, destination_lat, destination_lng
                )
                eta_minutes = int(dist.get("duration_minutes", 15))
            finally:
                await gmaps.close()

        await self.log_action(
            self.AGENT_NAME,
            "vehicle_dispatched",
            f"Dispatched {chosen.vehicle_type} {chosen.registration} for {task_type}. ETA: {eta_minutes} min.",
            {"vehicle_id": chosen.id, "task_type": task_type, "eta": eta_minutes},
        )

        await self.redis.publish(
            "ws:events",
            {
                "type": "fleet_update",
                "vehicle_id": chosen.id,
                "status": "on_mission",
                "eta": eta_minutes,
                "center_id": center_id,
            },
        )

        return {
            "vehicle_id": chosen.id,
            "eta_minutes": eta_minutes,
            "registration": chosen.registration,
        }