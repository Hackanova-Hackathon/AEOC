from sqlalchemy import select
from backend.agents.base_agent import BaseAgent
from backend.database.models.center import Center
from backend.database.models.inventory import Inventory


class DiplomatAgent(BaseAgent):
    AGENT_NAME = "Diplomat"

    async def request_resources(
        self,
        requesting_center_id: int,
        resource_type: str,
        quantity_needed: int,
    ) -> dict:
        """
        Find a donor center with surplus (quantity > threshold * 2).
        Transfer quantity_needed from donor to requester.
        Log actions on both centers, publish ws events.
        Returns {success, donor_center_name, quantity_transferred}.
        """
        # Find donor centers with surplus
        surplus_result = await self.db.execute(
            select(Inventory).where(
                Inventory.item_name.ilike(f"%{resource_type}%"),
                Inventory.center_id != requesting_center_id,
                Inventory.quantity > Inventory.threshold * 2,
            ).order_by(Inventory.quantity.desc())
        )
        donors = surplus_result.scalars().all()

        if not donors:
            await self.log_action(
                self.AGENT_NAME,
                "resource_request_failed",
                f"No surplus {resource_type} found for center {requesting_center_id}",
                {"resource_type": resource_type, "quantity_needed": quantity_needed},
            )
            return {"success": False, "donor_center_name": None, "quantity_transferred": 0}

        donor_inventory = donors[0]
        actual_transfer = min(quantity_needed, donor_inventory.quantity - donor_inventory.threshold)
        if actual_transfer <= 0:
            return {"success": False, "donor_center_name": None, "quantity_transferred": 0}

        # Get donor center name
        donor_center_result = await self.db.execute(
            select(Center).where(Center.id == donor_inventory.center_id)
        )
        donor_center = donor_center_result.scalar_one_or_none()
        donor_name = donor_center.name if donor_center else f"Center {donor_inventory.center_id}"

        # Get or create recipient inventory
        recipient_result = await self.db.execute(
            select(Inventory).where(
                Inventory.center_id == requesting_center_id,
                Inventory.item_name.ilike(f"%{resource_type}%"),
            )
        )
        recipient_inventory = recipient_result.scalar_one_or_none()

        # Deduct from donor
        donor_inventory.quantity -= actual_transfer

        # Add to recipient
        if recipient_inventory:
            recipient_inventory.quantity += actual_transfer
        else:
            new_item = Inventory(
                center_id=requesting_center_id,
                item_name=donor_inventory.item_name,
                quantity=actual_transfer,
                unit=donor_inventory.unit,
                threshold=donor_inventory.threshold,
            )
            self.db.add(new_item)

        await self.db.commit()

        # Log on donor center
        await self.log_action(
            self.AGENT_NAME,
            "resources_donated",
            f"Transferred {actual_transfer} {donor_inventory.unit} of {resource_type} to center {requesting_center_id}",
            {"donor_center_id": donor_inventory.center_id, "quantity": actual_transfer},
        )

        # Log on receiving center (temp swap center_id)
        orig_center_id = self.center_id
        self.center_id = requesting_center_id
        await self.log_action(
            self.AGENT_NAME,
            "resources_received",
            f"Received {actual_transfer} {donor_inventory.unit} of {resource_type} from {donor_name}",
            {"donor_center_name": donor_name, "quantity": actual_transfer},
        )
        self.center_id = orig_center_id

        # Publish ws events
        await self.redis.publish("ws:events", {
            "type": "center_update",
            "center_id": donor_inventory.center_id,
            "event": "resources_transferred",
        })
        await self.redis.publish("ws:events", {
            "type": "center_update",
            "center_id": requesting_center_id,
            "event": "resources_received",
        })

        return {
            "success": True,
            "donor_center_name": donor_name,
            "quantity_transferred": actual_transfer,
        }