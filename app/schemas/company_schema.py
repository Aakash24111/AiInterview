from pydantic import BaseModel

class CompanyBase(BaseModel):
    company_name: str  

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    company_id: int 

    class Config:
        orm_mode = True  
