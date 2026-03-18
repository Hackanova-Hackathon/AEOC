import asyncio
import json
import re
import google.generativeai as genai
from backend.config import settings


class GeminiClient:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    async def call_gemini(
        self, system_prompt: str, user_message: str, expect_json: bool = False
    ) -> str | dict:
        """
        Calls Gemini with a system prompt + user message.
        Returns parsed dict if expect_json=True, else plain text string.
        Retries once after 2s on 429 rate-limit errors.
        """
        full_prompt = f"{system_prompt}\n\nUser: {user_message}"

        for attempt in range(2):
            try:
                response = await asyncio.to_thread(
                    self.model.generate_content, full_prompt
                )
                text = response.text
                if expect_json:
                    return self.parse_json_safe(text)
                return text
            except Exception as e:
                error_str = str(e).lower()
                if "429" in error_str or "rate" in error_str:
                    if attempt == 0:
                        await asyncio.sleep(2)
                        continue
                raise

    def parse_json_safe(self, text: str) -> dict:
        """Strip ```json fences and parse JSON safely."""
        text = text.strip()
        # Remove markdown code fences
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
        text = re.sub(r"\s*```$", "", text, flags=re.MULTILINE)
        text = text.strip()
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Try to extract JSON object from the text
            match = re.search(r"\{.*\}", text, re.DOTALL)
            if match:
                return json.loads(match.group())
            return {"raw": text}