from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from typing import Literal

class Interview(BaseModel):
    user_id:int
    company_id:int
    company_name:str
    job_role:str
    job_id:int
    interview_id:int
    interview_result: Literal['pending','assessing','rejected','accepted'] = Field(default="pending")
    
class Conversation(BaseModel):
    candidate_message:str
    ai_message:str
    timestamp:datetime

class InterviewInstance(BaseModel):
    interview_id:int
    company_id:int
    company_name:str
    job_role:str
    job_id:int
    interview_result: Literal['pending','assessing','rejected','accepted']= Field(default="pending")
    conversation:List[Conversation]
    
class UserInterviews(BaseModel):
    user_id:int
    company_interviews:List[InterviewInstance]
    
class CompanyInterviewInstance(BaseModel):
    user_id:int
    user_name:int
    interview_id:int
    job_role:str
    job_id:str
    interview_result: Literal['pending','assessing','rejected','accepted']= Field(default="pending")
    conversation:List[Conversation]
    
class CompanyInterviews(BaseModel):
    company_id:int
    user_interviews:List[CompanyInterviewInstance]
    