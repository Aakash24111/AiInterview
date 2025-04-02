from sqlalchemy.orm import Session
from app.models.company_model import Company

# Create a new company
def create_company(db: Session, company_name: str, company_logo: str = None, about_company: str = None):
    db_company = Company(company_name=company_name, company_logo=company_logo, about_company=about_company)
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
def update_company(db: Session, company_id: int, company_name: str = None, company_logo: str = None, about_company: str = None):
    db_company = db.query(Company).filter(Company.company_id == company_id).first()
    if db_company:
        if company_name:
            db_company.company_name = company_name
        if company_logo:
            db_company.company_logo = company_logo
        if about_company:
            db_company.about_company = about_company
        
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
