from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base

class Company(Base):
    __tablename__ = "companies"

    company_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_name = Column(String, unique=True, index=True)
    about_company = Column(String, nullable=True)
    company_logo = Column(String, nullable=True)  # Added company logo field

    job_services = relationship("JobService", back_populates="company")
