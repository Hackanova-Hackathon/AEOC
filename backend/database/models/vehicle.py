from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from database.db import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    center_id = Column(Integer, ForeignKey("centers.id"), nullable=False)
    vehicle_type = Column(String, nullable=False)  # bus | truck | ambulance
    registration = Column(String, nullable=False)
    status = Column(String, default="idle")  # idle | on_mission | maintenance
    current_task = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())