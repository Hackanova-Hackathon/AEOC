from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from database.db import Base


class Sitrep(Base):
    __tablename__ = "sitreps"

    id = Column(Integer, primary_key=True, index=True)
    center_id = Column(Integer, ForeignKey("centers.id"), nullable=False)
    content = Column(Text, nullable=False)
    generated_by = Column(String, default="agent")  # agent | manual
    created_at = Column(DateTime(timezone=True), server_default=func.now())