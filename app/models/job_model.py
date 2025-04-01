from sqlalchemy import Column, Integer, String, Float, Boolean, Text, Enum, Date , ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base
from enum import Enum as PyEnum

# Enum Class Definition
class JobTypeEnum(PyEnum):
    remote = "remote"
    hybrid = "hybrid"
    on_site = "on site"



class JobService(Base):
    __tablename__ = "job_services"

    job_id = Column(Integer, primary_key=True, index=True,autoincrement=True)
    company_id = Column(Integer, ForeignKey("companies.company_id"), nullable=False)
    job_description = Column(Text, nullable=False)
    job_location = Column(String, nullable=False)
    job_type = Column(Enum(JobTypeEnum), nullable=False) 
    salary = Column(Integer, nullable=False)
    experience = Column(Integer, nullable=False)
    num_of_questions = Column(Integer, nullable=False)
    difficulty_level = Column(String, nullable=False) 
    valid_through_start = Column(Date, nullable=False)
    valid_through_end = Column(Date, nullable=False)
    include_dsa_questions = Column(String, nullable=False) 
    num_of_dsa_questions = Column(Integer, nullable=True)
    include_predefined_questions = Column(String, nullable=False)  
    predefined_questions_list = Column(Text, nullable=True)
    eligibility_criteria = Column(Text, nullable=True)
    eligibility_threshold = Column(Integer, nullable=True)
    job_roles = Column(String, nullable=False)  

    company = relationship("Company", back_populates="job_services")
