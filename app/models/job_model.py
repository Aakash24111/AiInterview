from sqlalchemy import Column, Integer, String, Text, Enum, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base
from enum import Enum as PyEnum

# Enum Class Definition for Job Type
class JobTypeEnum(PyEnum):
    remote = "remote"
    hybrid = "hybrid"
    on_site = "on site"

class JobService(Base):
    __tablename__ = "job_services"

    job_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey("companies.company_id"), nullable=False)
    job_title = Column(String, nullable=False)
    experience = Column(Integer, nullable=False)  # Changed to Integer
    salary = Column(Integer, nullable=False)
    job_type = Column(Enum(JobTypeEnum), nullable=False)
    job_location = Column(String, nullable=False)
    posted_date = Column(Date, nullable=False)  # Changed from String to Date
    application_deadline = Column(Date, nullable=False)
    job_description = Column(String, nullable=False)
    responsibilities = Column(String, nullable=True)
    requirements = Column(String, nullable=True)
    benefits = Column(String, nullable=True)
    team_size = Column(String, nullable=True)
    interview_process = Column(String, nullable=True)
    num_of_questions = Column(Integer, nullable=False)
    difficulty_level = Column(String, nullable=False)
    valid_through_start = Column(Date, nullable=False)
    valid_through_end = Column(Date, nullable=False)
    include_dsa_questions = Column(Boolean, nullable=False)  # Changed to Boolean
    num_of_dsa_questions = Column(Integer, nullable=True)
    include_predefined_questions = Column(Boolean, nullable=False)  # Changed to Boolean
    predefined_questions_list = Column(String, nullable=True)
    eligibility_criteria = Column(String, nullable=True)
    eligibility_threshold = Column(Integer, nullable=True)
    job_roles = Column(String, nullable=False)

    company = relationship("Company", back_populates="job_services")

