from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from database.db import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    role = Column(String, nullable=False)  # citizen | agent
    content = Column(Text, nullable=False)
    agent_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())