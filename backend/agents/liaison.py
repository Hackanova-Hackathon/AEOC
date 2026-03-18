from sqlalchemy import select
from backend.agents.base_agent import BaseAgent
from backend.database.models.conversation import Conversation
from backend.database.models.message import Message
from backend.database.models.center import Center


LIAISON_SYSTEM_PROMPT = """You are a disaster relief triage assistant. 
Analyze the citizen message and extract:
- intent: what they need (shelter, medical, extraction, food, water, info)
- urgency: 1-5 (5=critical/life threatening)
- location_text: any location mentioned, else null
- needs_extraction: true if they are trapped or need physical rescue
- medical_needed: true if medical emergency mentioned
- language: detected language code (en, hi, mr, etc.)

Respond ONLY with valid JSON, no explanation."""

REPLY_SYSTEM_PROMPT = """You are a compassionate disaster relief coordinator.
Write a short, reassuring reply to the citizen in the language they used.
Include: acknowledgement, what help is being sent, estimated wait if known.
Keep it under 160 characters. Respond with ONLY the message text."""


class LiaisonAgent(BaseAgent):
    AGENT_NAME = "Liaison"

    async def process_message(self, from_number: str, body: str) -> str:
        """
        Full pipeline:
        1. Upsert Conversation, save citizen Message.
        2. Gemini: extract intent/urgency/etc.
        3. Find best center.
        4. Dispatch if extraction needed.
        5. Check medical if needed.
        6. Compose & send reply.
        7. Save agent Message.
        8. Publish ws event.
        """
        # 1. Upsert conversation
        result = await self.db.execute(
            select(Conversation).where(Conversation.from_number == from_number)
        )
        conversation = result.scalar_one_or_none()
        if not conversation:
            conversation = Conversation(
                from_number=from_number,
                center_id=self.center_id,
                status="active",
                urgency=3,
            )
            self.db.add(conversation)
            await self.db.commit()
            await self.db.refresh(conversation)

        citizen_msg = Message(
            conversation_id=conversation.id,
            role="citizen",
            content=body,
        )
        self.db.add(citizen_msg)
        await self.db.commit()

        # 2. Gemini extraction
        extracted = await self.gemini.call_gemini(
            LIAISON_SYSTEM_PROMPT, body, expect_json=True
        )
        urgency = int(extracted.get("urgency", 3))
        language = extracted.get("language", "en")
        needs_extraction = extracted.get("needs_extraction", False)
        medical_needed = extracted.get("medical_needed", False)
        location_text = extracted.get("location_text", "")

        # Update conversation urgency
        conversation.urgency = urgency
        await self.db.commit()

        await self.log_action(
            self.AGENT_NAME,
            "triage",
            f"Triaged message from {from_number}: urgency={urgency}, intent={extracted.get('intent')}",
            {"extracted": extracted},
        )

        # 3. Find nearest available center
        center_result = await self.db.execute(
            select(Center)
            .where(Center.status.in_(["online", "near_full"]))
            .order_by(Center.occupied_beds.asc())
            .limit(1)
        )
        best_center = center_result.scalar_one_or_none()
        center_info = ""
        if best_center:
            center_info = f"You will be directed to {best_center.name} at {best_center.address}."
            conversation.center_id = best_center.id
            await self.db.commit()

        # 4. Dispatch if extraction needed
        eta_info = ""
        if needs_extraction and best_center:
            from backend.agents.dispatcher import DispatcherAgent
            dispatcher = DispatcherAgent(
                best_center.id, self.db, self.redis, self.gemini
            )
            dispatch_result = await dispatcher.assign_vehicle(
                best_center.id, "extraction",
                best_center.lat, best_center.lng
            )
            if dispatch_result:
                eta_info = f"Vehicle {dispatch_result.get('registration','dispatched')} ETA: {dispatch_result.get('eta_minutes',15)} min."

        # 5. Check medical if needed
        redirect_info = ""
        if medical_needed and best_center:
            from backend.agents.healer import HealerAgent
            healer = HealerAgent(
                best_center.id, self.db, self.redis, self.gemini
            )
            medical_result = await healer.check_medical(
                best_center.id, extracted.get("intent", "medical")
            )
            if not medical_result.get("can_handle") and medical_result.get("redirect_center_name"):
                redirect_info = f"Medical care available at {medical_result['redirect_center_name']}, {medical_result.get('redirect_address','')}."

        # 6. Compose reply
        context = f"{center_info} {eta_info} {redirect_info}".strip()
        reply_prompt = f"Language: {language}. Context to include: {context}"
        reply_text = await self.gemini.call_gemini(REPLY_SYSTEM_PROMPT, reply_prompt)
        reply_text = reply_text.strip().strip('"')

        # 7. Send via Twilio
        if self.twilio:
            self.twilio.send_whatsapp(from_number, reply_text)

        # 8. Save agent Message
        agent_msg = Message(
            conversation_id=conversation.id,
            role="agent",
            content=reply_text,
            agent_name=self.AGENT_NAME,
        )
        self.db.add(agent_msg)
        await self.db.commit()

        await self.log_action(
            self.AGENT_NAME,
            "reply_sent",
            f"Replied to {from_number}",
            {"reply": reply_text},
        )

        # 9. Publish new_message ws event
        await self.redis.publish(
            "ws:events",
            {
                "type": "new_message",
                "conversation_id": conversation.id,
                "from_number": from_number,
                "agent_reply": reply_text,
            },
        )

        return reply_text