from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, func
from database.db import Base


class Center(Base):
    __tablename__ = "centers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

    total_beds = Column(Integer, default=0)
    occupied_beds = Column(Integer, default=0)

    doctor_count = Column(Integer, default=0)
    nurse_count = Column(Integer, default=0)
    paramedic_count = Column(Integer, default=0)
    surgeon_count = Column(Integer, default=0)
    icu_nurse_count = Column(Integer, default=0)
    staff_count = Column(Integer, default=0)

    status = Column(String, default="online")  # online | full | offline

    has_blood_bank = Column(Boolean, default=False)
    blood_units_a_pos = Column(Integer, default=0)
    blood_units_a_neg = Column(Integer, default=0)
    blood_units_b_pos = Column(Integer, default=0)
    blood_units_b_neg = Column(Integer, default=0)
    blood_units_o_pos = Column(Integer, default=0)
    blood_units_o_neg = Column(Integer, default=0)
    blood_units_ab_pos = Column(Integer, default=0)
    blood_units_ab_neg = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())