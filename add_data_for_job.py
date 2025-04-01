from sqlalchemy.orm import Session
# from app.db.database import SessionLocal  # Import SessionLocal from your database setup
from app.models.job_model import JobService, JobTypeEnum
from app.models.company_model import  Company  # Import your models
from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
SQLALCHEMY_DATABASE_URL = "postgresql://Aakash:aakash@localhost:5432/postgres"

# Create the engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Function to add a company if not exists
def get_or_create_company(db: Session, company_name: str):
    company = db.query(Company).filter(Company.company_name == company_name).first()
    if not company:
        company = Company(company_name=company_name)
        db.add(company)
        db.commit()
        db.refresh(company)
    return company

# Function to add job service data to the database
def create_job_service(db: Session, company_id: int, job_description: str, job_location: str, job_type: JobTypeEnum, salary: int, experience: int,
                       num_of_questions: int, difficulty_level: str, valid_through_start: date, valid_through_end: date,
                       include_dsa_questions: str, num_of_dsa_questions: int, include_predefined_questions: str, predefined_questions_list: str,
                       eligibility_criteria: str, eligibility_threshold: int, job_roles: str):
    # Create an instance of JobService
    job_service = JobService(
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
        job_roles=job_roles
    )
    
    # Add to the session and commit
    db.add(job_service)
    db.commit()
    db.refresh(job_service)
    
    return job_service

# Function to add multiple sample job services
def add_sample_job_services():
    db = SessionLocal()  # Create a database session
    
    # Ensure a company exists before adding jobs
    company = get_or_create_company(db, "TechCorp")  # Change company name as needed

    # Sample job services
    job_services_data = [
        {
            "company_id": company.company_id,
            "job_description": "Backend Software Engineer focused on API development.",
            "job_location": "Remote",
            "job_type": JobTypeEnum.remote,
            "salary": 90000,
            "experience": 2,
            "num_of_questions": 12,
            "difficulty_level": "Intermediate",
            "valid_through_start": date(2025, 4, 1),
            "valid_through_end": date(2025, 12, 31),
            "include_dsa_questions": "Yes",
            "num_of_dsa_questions": 6,
            "include_predefined_questions": "Yes",
            "predefined_questions_list": "Q1: Explain REST APIs, Q2: Design a system for a large scale app.",
            "eligibility_criteria": "Bachelor's Degree in Computer Science or related field.",
            "eligibility_threshold": 75,
            "job_roles": "Backend Developer, API Developer"
        },
        {
            "company_id": company.company_id,
            "job_description": "Full Stack Developer with a focus on JavaScript frameworks.",
            "job_location": "Hybrid",
            "job_type": JobTypeEnum.hybrid,
            "salary": 95000,
            "experience": 3,
            "num_of_questions": 15,
            "difficulty_level": "Advanced",
            "valid_through_start": date(2025, 5, 1),
            "valid_through_end": date(2025, 11, 30),
            "include_dsa_questions": "Yes",
            "num_of_dsa_questions": 8,
            "include_predefined_questions": "Yes",
            "predefined_questions_list": "Q1: Explain closures in JavaScript, Q2: Implement a binary search algorithm.",
            "eligibility_criteria": "5+ years of experience with full-stack development.",
            "eligibility_threshold": 80,
            "job_roles": "Full Stack Developer, JavaScript Developer"
        },
        {
            "company_id": company.company_id,
            "job_description": "Mobile App Developer with expertise in Android.",
            "job_location": "On-site",
            "job_type": JobTypeEnum.on_site,
            "salary": 85000,
            "experience": 2,
            "num_of_questions": 10,
            "difficulty_level": "Intermediate",
            "valid_through_start": date(2025, 6, 1),
            "valid_through_end": date(2025, 9, 30),
            "include_dsa_questions": "No",
            "num_of_dsa_questions": 0,
            "include_predefined_questions": "Yes",
            "predefined_questions_list": "Q1: Explain the lifecycle of an Android app.",
            "eligibility_criteria": "Experience with Android development for at least 2 years.",
            "eligibility_threshold": 70,
            "job_roles": "Mobile Developer, Android Developer"
        },
        {
            "company_id": company.company_id,
            "job_description": "Data Scientist with a focus on machine learning and data analysis.",
            "job_location": "Remote",
            "job_type": JobTypeEnum.remote,
            "salary": 110000,
            "experience": 4,
            "num_of_questions": 20,
            "difficulty_level": "Advanced",
            "valid_through_start": date(2025, 7, 1),
            "valid_through_end": date(2025, 12, 31),
            "include_dsa_questions": "Yes",
            "num_of_dsa_questions": 10,
            "include_predefined_questions": "Yes",
            "predefined_questions_list": "Q1: Explain different clustering algorithms, Q2: How would you optimize a machine learning model?",
            "eligibility_criteria": "Master's in Data Science or related field.",
            "eligibility_threshold": 85,
            "job_roles": "Data Scientist, Machine Learning Engineer"
        },
        {
            "company_id": company.company_id,
            "job_description": "DevOps Engineer with expertise in CI/CD pipelines.",
            "job_location": "On-site",
            "job_type": JobTypeEnum.on_site,
            "salary": 105000,
            "experience": 5,
            "num_of_questions": 8,
            "difficulty_level": "Expert",
            "valid_through_start": date(2025, 5, 1),
            "valid_through_end": date(2025, 11, 30),
            "include_dsa_questions": "Yes",
            "num_of_dsa_questions": 4,
            "include_predefined_questions": "Yes",
            "predefined_questions_list": "Q1: How do you handle containerization in Kubernetes?",
            "eligibility_criteria": "5+ years of experience in DevOps.",
            "eligibility_threshold": 90,
            "job_roles": "DevOps Engineer, Cloud Engineer"
        }
    ]
    
    # Loop through each record and create the job service
    for job_service_data in job_services_data:
        create_job_service(db, **job_service_data)
        print(f"Job Service added: {job_service_data['job_description']}, {job_service_data['salary']}")
    
    # Close the session
    db.close()

# Run the function to add the sample data
if __name__ == "__main__":
    add_sample_job_services()
