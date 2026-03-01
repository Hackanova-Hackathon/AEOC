from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from database.db import Base


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    center_id = Column(Integer, ForeignKey("centers.id"), nullable=False)
    item_name = Column(String, nullable=False)
    quantity = Column(Float, default=0)
    unit = Column(String, nullable=False)
    threshold = Column(Float, default=0)  # reorder point
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())