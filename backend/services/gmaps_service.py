import httpx
from backend.config import settings


class GMapsClient:
    GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"
    DISTANCE_URL = "https://maps.googleapis.com/maps/api/distancematrix/json"

    def __init__(self):
        self.api_key = settings.GOOGLE_MAPS_API_KEY
        self.client = httpx.AsyncClient(timeout=10.0)

    async def geocode(self, address: str) -> dict:
        """
        Returns {lat, lng, formatted_address} for a given address string.
        Raises ValueError if no results found.
        """
        resp = await self.client.get(
            self.GEOCODE_URL,
            params={"address": address, "key": self.api_key},
        )
        data = resp.json()
        if not data.get("results"):
            raise ValueError(f"No geocoding results for: {address}")
        result = data["results"][0]
        location = result["geometry"]["location"]
        return {
            "lat": location["lat"],
            "lng": location["lng"],
            "formatted_address": result["formatted_address"],
        }

    async def distance_matrix(
        self,
        origin_lat: float,
        origin_lng: float,
        dest_lat: float,
        dest_lng: float,
    ) -> dict:
        """
        Returns {distance_km, duration_minutes} between two lat/lng points.
        Falls back to 0 values on API error.
        """
        origin = f"{origin_lat},{origin_lng}"
        destination = f"{dest_lat},{dest_lng}"
        try:
            resp = await self.client.get(
                self.DISTANCE_URL,
                params={
                    "origins": origin,
                    "destinations": destination,
                    "key": self.api_key,
                },
            )
            data = resp.json()
            element = data["rows"][0]["elements"][0]
            if element["status"] != "OK":
                return {"distance_km": 0, "duration_minutes": 0}
            distance_km = element["distance"]["value"] / 1000
            duration_minutes = element["duration"]["value"] / 60
            return {
                "distance_km": round(distance_km, 2),
                "duration_minutes": round(duration_minutes, 1),
            }
        except Exception:
            return {"distance_km": 0, "duration_minutes": 0}

    async def close(self):
        await self.client.aclose()