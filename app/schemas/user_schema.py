from pydantic import BaseModel, Field
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    phone: str
    resume_filename: Optional[str] = None
    resume_data: Optional[bytes] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    resume_filename: Optional[str] = None
