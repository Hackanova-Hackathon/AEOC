import logging
from twilio.rest import Client
from backend.config import settings

logger = logging.getLogger(__name__)


class TwilioClient:
    def __init__(self):
        self.client = Client(
            settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN
        )
        self.from_number = settings.TWILIO_WHATSAPP_FROM

    def send_whatsapp(self, to_number: str, body: str) -> bool:
        """
        Send a WhatsApp message via Twilio.
        to_number should be in E.164 format e.g. '+919876543210'.
        Returns True on success, False on error (does not raise).
        """
        try:
            message = self.client.messages.create(
                from_=f"whatsapp:{self.from_number}",
                to=f"whatsapp:{to_number}",
                body=body,
            )
            logger.info(
                "WhatsApp sent to %s | SID: %s", to_number, message.sid
            )
            return True
        except Exception as e:
            logger.error("Failed to send WhatsApp to %s: %s", to_number, e)
            return False