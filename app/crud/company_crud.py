# company_crud.py
from sqlalchemy.orm import Session
from app.models.company_model import Company

# Create a new company
def create_company(db: Session, company_name: str):
    db_company = Company(company_name=company_name)
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

# Get all companies
def get_companies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Company).offset(skip).limit(limit).all()

# Get a company by company_id
def get_company(db: Session, company_id: int):
    return db.query(Company).filter(Company.company_id == company_id).first()

# Update company details
def update_company(db: Session, company_id: int, company_name: str):
    db_company = db.query(Company).filter(Company.company_id == company_id).first()
    if db_company:
        db_company.company_name = company_name
        db.commit()
        db.refresh(db_company)
        return db_company
    return None

# Delete a company
def delete_company(db: Session, company_id: int):
    db_company = db.query(Company).filter(Company.company_id == company_id).first()
    if db_company:
        db.delete(db_company)
        db.commit()
        return db_company
    return None
