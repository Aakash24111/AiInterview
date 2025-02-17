from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class JobTypeEnum(str):
    remote = "remote"
    hybrid = "hybrid"
    on_site = "on site"


# Base class for Job schema
class JobServiceBase(BaseModel):
    job_description: str
    job_location: str
    job_type: JobTypeEnum
    salary: int
    experience: int
    num_of_questions: int
    difficulty_level: str  # Just a string, no enum
    valid_through_start: date
    valid_through_end: date
    include_dsa_questions: str
    num_of_dsa_questions: Optional[int] = None
    include_predefined_questions: str
    predefined_questions_list: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    eligibility_threshold: Optional[int] = None
    job_roles: List[str]  # Ensure job_roles is a list of strings


# Schema for creating a job service
class JobServiceCreate(JobServiceBase):
    company_id: int  # Company ID to associate with the job

    class Config:
        orm_mode = True


# Schema for updating a job service
class JobServiceUpdate(JobServiceBase):
    job_description: Optional[str] = None
    job_location: Optional[str] = None
    job_type: Optional[JobTypeEnum] = None
    salary: Optional[int] = None
    experience: Optional[int] = None
    num_of_questions: Optional[int] = None
    difficulty_level: Optional[str] = None  # Just a string, no enum
    valid_through_start: Optional[date] = None
    valid_through_end: Optional[date] = None
    include_dsa_questions: Optional[str] = None
    num_of_dsa_questions: Optional[int] = None
    include_predefined_questions: Optional[str] = None
    predefined_questions_list: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    eligibility_threshold: Optional[int] = None
    job_roles: Optional[List[str]]  # Job roles as a list of strings


# Schema for the response when fetching or listing job services
class JobServiceResponse(JobServiceBase):
    job_id: int  # Job ID (primary key)
    company_id: int  # Company ID (foreign key reference)

    class Config:
        orm_mode = True  # Tells Pydantic to treat the SQLAlchemy model as a dictionary
