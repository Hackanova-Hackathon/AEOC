from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from database.db import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    from_number = Column(String, nullable=False, index=True)
    center_id = Column(Integer, ForeignKey("centers.id"), nullable=True)
    status = Column(String, default="active")  # active | resolved | flagged
    urgency = Column(Integer, default=1)  # 1-5
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())