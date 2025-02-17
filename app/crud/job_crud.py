from sqlalchemy.orm import Session
from app.models.job_model import JobService

def create_job_service(db: Session, company_id: int, job_description: str, job_location: str, job_type: str,
                       salary: float, experience: int, num_of_questions: int, difficulty_level: str, 
                       valid_through_start: str, valid_through_end: str, include_dsa_questions: str, 
                       num_of_dsa_questions: int, include_predefined_questions: str, predefined_questions_list: str,
                       eligibility_criteria: str, eligibility_threshold: float, job_roles: list):
    try:
        db_job_service = JobService(
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
            job_roles=",".join(job_roles) if job_roles else None
        )
        db.add(db_job_service)
        db.commit()
        db.refresh(db_job_service)
        return db_job_service
    except Exception as e:
        print(f"Error occurred while creating job service: {str(e)}")
        raise


def get_job_services(db: Session, skip: int = 0, limit: int = 100):
    return db.query(JobService).offset(skip).limit(limit).all()


def get_job_service_by_id(db: Session, job_id: int):
    return db.query(JobService).filter(JobService.job_id == job_id).first()


def update_job_service(db: Session, job_id: int, company_id: int = None, job_description: str = None, 
                       job_location: str = None, job_type: str = None, salary: float = None, 
                       experience: int = None, num_of_questions: int = None, difficulty_level: str = None, 
                       valid_through_start: str = None, valid_through_end: str = None, 
                       include_dsa_questions: bool = None, num_of_dsa_questions: int = None, 
                       include_predefined_questions: bool = None, predefined_questions_list: str = None, 
                       eligibility_criteria: str = None, eligibility_threshold: float = None, 
                       job_roles: list = None):
    db_job_service = db.query(JobService).filter(JobService.job_id == job_id).first()
    
    if db_job_service:
        # Update only the fields that are provided
        db_job_service.company_id = company_id or db_job_service.company_id
        db_job_service.job_description = job_description or db_job_service.job_description
        db_job_service.job_location = job_location or db_job_service.job_location
        db_job_service.job_type = job_type or db_job_service.job_type
        db_job_service.salary = salary or db_job_service.salary
        db_job_service.experience = experience or db_job_service.experience
        db_job_service.num_of_questions = num_of_questions or db_job_service.num_of_questions
        db_job_service.difficulty_level = difficulty_level or db_job_service.difficulty_level
        db_job_service.valid_through_start = valid_through_start or db_job_service.valid_through_start
        db_job_service.valid_through_end = valid_through_end or db_job_service.valid_through_end
        db_job_service.include_dsa_questions = include_dsa_questions or db_job_service.include_dsa_questions
        db_job_service.num_of_dsa_questions = num_of_dsa_questions or db_job_service.num_of_dsa_questions
        db_job_service.include_predefined_questions = include_predefined_questions or db_job_service.include_predefined_questions
        db_job_service.predefined_questions_list = predefined_questions_list or db_job_service.predefined_questions_list
        db_job_service.eligibility_criteria = eligibility_criteria or db_job_service.eligibility_criteria
        db_job_service.eligibility_threshold = eligibility_threshold or db_job_service.eligibility_threshold
        
        # Update job roles: check if new roles are provided
        if job_roles:
            db_job_service.job_roles = ",".join(job_roles)
        
        db.commit()
        db.refresh(db_job_service)
    
    return db_job_service


def delete_job_service(db: Session, job_id: int):
    db_job_service = db.query(JobService).filter(JobService.job_id == job_id).first()
    
    if db_job_service:
        db.delete(db_job_service)
        db.commit()
    
    return db_job_service
