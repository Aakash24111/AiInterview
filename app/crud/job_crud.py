from sqlalchemy.orm import Session, joinedload
from app.models.job_model import JobService
from app.models.company_model import Company

def create_job_service(db: Session, **job_data):
    try:
        db_job_service = JobService(**job_data)
        db.add(db_job_service)
        db.commit()
        db.refresh(db_job_service)
        return db_job_service
    except Exception as e:
        print(f"Error occurred while creating job service: {str(e)}")
        raise

def get_job_services(db: Session, skip: int = 0, limit: int = 100):
    job_services = (
        db.query(JobService)
        .options(joinedload(JobService.company))
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [
        {
            "job_id": job.job_id,
            "company_logo": job.company.company_logo,
            "job_title": job.job_title,
            "company_name": job.company.company_name if job.company else None,
            "about_company": job.company.about_company if job.company else None,
            "experience": job.experience,  # Now an integer, removed `.value`
            "salary": job.salary,
            "job_type": job.job_type.value,  # Still Enum, kept `.value`
            "job_location": job.job_location,
            "posted_date": job.posted_date,
            "application_deadline": job.application_deadline,
            "job_description": job.job_description,
            "responsibilities": job.responsibilities,
            "requirements": job.requirements,
            "benefits": job.benefits,
            "team_size": job.team_size,
            "interview_process": job.interview_process,
            "num_of_questions": job.num_of_questions,
            "difficulty_level": job.difficulty_level,
            "valid_through_start": job.valid_through_start,
            "valid_through_end": job.valid_through_end,
            "include_dsa_questions": job.include_dsa_questions,  # Boolean
            "num_of_dsa_questions": job.num_of_dsa_questions,
            "include_predefined_questions": job.include_predefined_questions,  # Boolean
            "predefined_questions_list": job.predefined_questions_list,
            "eligibility_criteria": job.eligibility_criteria,
            "eligibility_threshold": job.eligibility_threshold,
            "job_roles": job.job_roles,
        }
        for job in job_services
    ]
    
def get_job_service_by_id(db: Session, job_id: int):
    return db.query(JobService).options(joinedload(JobService.company)).filter(JobService.job_id == job_id).first()

def update_job_service(db: Session, job_id: int, **update_data):
    db_job_service = db.query(JobService).filter(JobService.job_id == job_id).first()
    
    if db_job_service:  
        for key, value in update_data.items():
            if value is not None:
                setattr(db_job_service, key, value)
        
        db.commit()
        db.refresh(db_job_service)
    
    return db_job_service

def delete_job_service(db: Session, job_id: int):
    db_job_service = db.query(JobService).filter(JobService.job_id == job_id).first()
    
    if db_job_service:
        db.delete(db_job_service)
        db.commit()
    
    return db_job_service
