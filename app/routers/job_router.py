from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.crud.job_crud import create_job_service, get_job_services, get_job_service_by_id, update_job_service, delete_job_service
from app.models.job_model import JobService

router = APIRouter(prefix="/job",
    tags=["JobService"])

# Create a new job service
@router.post("/job_service/")
def create_job_service_endpoint(
    company_id: int,
    job_description: str,
    job_location: str,
    job_type: str,
    salary: float,
    experience: int,
    num_of_questions: int,
    difficulty_level: str,
    valid_through_start: str,
    valid_through_end: str,
    include_dsa_questions: str,
    num_of_dsa_questions: int,
    include_predefined_questions: str,
    predefined_questions_list: str,
    eligibility_criteria: str,
    eligibility_threshold: float,
    job_roles: str,  # Changed this to a string to handle it as comma-separated
    db: Session = Depends(get_db)
):
    # Convert job_roles from comma-separated string to a list of strings
    job_roles_list = job_roles.split(',')  # This will split the string into a list
    
    return create_job_service(
        db=db,
        company_id=company_id,
        job_description=job_description,
        job_location=job_location,
        job_type=job_type,
        salary=salary,
        experience=experience,
        num_of_questions=num_of_questions,
        difficulty_level=difficulty_level,
        valid_through_start=valid_through_start,
        valid_through_end=valid_through_end,
        include_dsa_questions=include_dsa_questions,
        num_of_dsa_questions=num_of_dsa_questions,
        include_predefined_questions=include_predefined_questions,
        predefined_questions_list=predefined_questions_list,
        eligibility_criteria=eligibility_criteria,
        eligibility_threshold=eligibility_threshold,
        job_roles=job_roles_list  # Passing the list now
    )

# Get all job services
@router.get("/job_services/")
def get_job_services_endpoint(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    return get_job_services(db, skip, limit)

# Get job service by job_id
@router.get("/job_service/{job_id}")
def get_job_service_by_id_endpoint(job_id: int, db: Session = Depends(get_db)):
    db_job_service = get_job_service_by_id(db, job_id)
    if db_job_service is None:
        raise HTTPException(status_code=404, detail="Job service not found")
    return db_job_service

# Update a job service
@router.put("/job_service/{job_id}")
def update_job_service_endpoint(
    job_id: int,
    company_id: int = None,
    job_description: str = None,
    job_location: str = None,
    job_type: str = None,
    salary: float = None,
    experience: int = None,
    num_of_questions: int = None,
    difficulty_level: str = None,
    valid_through_start: str = None,
    valid_through_end: str = None,
    include_dsa_questions: bool = None,
    num_of_dsa_questions: int = None,
    include_predefined_questions: bool = None,
    predefined_questions_list: str = None,
    eligibility_criteria: str = None,
    eligibility_threshold: float = None,
    job_roles: str = None,  # Changed this to a string for input as comma-separated values
    db: Session = Depends(get_db)
):
    # Convert job_roles from comma-separated string to a list of strings
    if job_roles:
        job_roles_list = job_roles.split(',')
    else:
        job_roles_list = []

    return update_job_service(
        db=db,
        job_id=job_id,
        company_id=company_id,
        job_description=job_description,
        job_location=job_location,
        job_type=job_type,
        salary=salary,
        experience=experience,
        num_of_questions=num_of_questions,
        difficulty_level=difficulty_level,
        valid_through_start=valid_through_start,
        valid_through_end=valid_through_end,
        include_dsa_questions=include_dsa_questions,
        num_of_dsa_questions=num_of_dsa_questions,
        include_predefined_questions=include_predefined_questions,
        predefined_questions_list=predefined_questions_list,
        eligibility_criteria=eligibility_criteria,
        eligibility_threshold=eligibility_threshold,
        job_roles=job_roles_list  # Pass as list here
    )

# Delete a job service
@router.delete("/job_service/{job_id}")
def delete_job_service_endpoint(job_id: int, db: Session = Depends(get_db)):
    db_job_service = delete_job_service(db, job_id)
    if db_job_service is None:
        raise HTTPException(status_code=404, detail="Job service not found")
    return {"message": "Job service deleted successfully"}
