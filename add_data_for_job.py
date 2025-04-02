from datetime import date
from sqlalchemy.orm import Session
from app.models.job_model import JobService, JobTypeEnum
from app.models.company_model import Company
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://Aakash:aakash@localhost:5432/postgres"

# Create the engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Function to add a company if not exists
def get_or_create_company(db: Session, company_name: str, about_company: str, company_logo: str):
    company = db.query(Company).filter(Company.company_name == company_name).first()
    if not company:
        company = Company(company_name=company_name, about_company=about_company, company_logo=company_logo)
        db.add(company)
        db.commit()
        db.refresh(company)
    return company

# Function to add job service data to the database
def create_job_service(db: Session, **job_data):
    job_service = JobService(**job_data)
    db.add(job_service)
    db.commit()
    db.refresh(job_service)
    return job_service

# Function to add multiple sample companies and job services
def add_sample_data():
    db = SessionLocal()  # Create a database session
    
    # Sample companies
    companies_data = [
        {"company_name": "TechCorp", "about_company": "TechCorp is a pioneering software development company specializing in cloud computing, AI, and automation.", "company_logo": "techcorp_logo.png"},
        {"company_name": "InnovateX", "about_company": "InnovateX is an AI research firm dedicated to cutting-edge deep learning and NLP advancements.", "company_logo": "innovatex_logo.png"},
        {"company_name": "DataGenix", "about_company": "DataGenix specializes in big data analytics and AI-driven insights.", "company_logo": "datagenix_logo.png"},
        {"company_name": "CyberShield", "about_company": "CyberShield provides advanced cybersecurity solutions to protect businesses worldwide.", "company_logo": "cybershield_logo.png"},
        {"company_name": "GreenTech Solutions", "about_company": "GreenTech Solutions is a leader in renewable energy and sustainable technology.", "company_logo": "greentech_logo.png"},
    ]
    
    companies = {data["company_name"]: get_or_create_company(db, **data) for data in companies_data}
    
    # Sample job services with expanded details
    job_services_data = [
        {
            "company_id": companies["InnovateX"].company_id,
            "job_title": "AI Research Scientist",
            "experience": 5,
            "salary": 150000,
            "job_type": JobTypeEnum.remote,
            "job_location": "Remote",
            "posted_date": date(2025, 4, 1),
            "application_deadline": date(2025, 6, 30),
            "job_description": """Join InnovateX as an AI Research Scientist and push the boundaries of artificial intelligence. You'll work on advanced deep learning models, 
            contribute to cutting-edge research, and collaborate with top-tier AI experts worldwide.""",
            "responsibilities": """- Research and develop novel AI models.
            - Collaborate with academic institutions and industry leaders.
            - Optimize neural networks for efficiency and scalability.
            - Publish research papers and present findings at AI conferences.""",
            "requirements": """- PhD in AI, ML, or related fields.
            - Strong understanding of deep learning architectures (Transformers, GANs, CNNs).
            - Experience with PyTorch, TensorFlow, and large-scale datasets.
            - Publications in top AI journals or conferences are a plus.""",
            "benefits": """- Research funding and conference sponsorship.
            - Stock options and competitive salary.
            - Flexible remote work with global exposure.""",
            "team_size": "10-20",
            "interview_process": """The interview process for this role consists of multiple stages:
            1. **Initial Screening** - A recruiter will assess your research background and expertise.
            2. **Technical AI Assessment** - Solve AI-related coding challenges and research-based problems.
            3. **Paper Discussion Round** - Discuss your past research papers and contributions.
            4. **Final Interview with AI Experts** - Present a research proposal and discuss industry challenges.
            5. **Offer Discussion & Final Decision** - A final discussion about compensation and next steps.""",
            "num_of_questions": 8,
            "difficulty_level": "Expert",
            "valid_through_start": date(2025, 4, 15),
            "valid_through_end": date(2025, 12, 31),
            "include_dsa_questions": True,
            "num_of_dsa_questions": 5,
            "include_predefined_questions": False,
            "predefined_questions_list": None,
            "eligibility_criteria": "PhD in AI or ML",
            "eligibility_threshold": 85,
            "job_roles": "AI Researcher, Deep Learning Scientist, Machine Learning Engineer"
        },
        {
            "company_id": companies["TechCorp"].company_id,
            "job_title": "Cloud DevOps Engineer",
            "experience": 4,
            "salary": 120000,
            "job_type": JobTypeEnum.hybrid,
            "job_location": "San Francisco",
            "posted_date": date(2025, 3, 20),
            "application_deadline": date(2025, 5, 31),
            "job_description": """As a Cloud DevOps Engineer, you will be responsible for managing and optimizing cloud infrastructure, CI/CD pipelines, and ensuring system reliability for TechCorp’s high-scale applications.""",
            "responsibilities": """- Automate and optimize cloud infrastructure.
            - Maintain CI/CD pipelines for seamless deployment.
            - Ensure security and compliance in cloud environments.
            - Work closely with development teams to improve system performance.""",
            "requirements": """- Expertise in AWS, Kubernetes, and Terraform.
            - Experience with Docker, Jenkins, and GitOps workflows.
            - Strong scripting skills (Bash, Python).
            - Solid knowledge of monitoring tools like Prometheus and Grafana.""",
            "benefits": """- Flexible hybrid work environment.
            - Company-sponsored cloud certifications.
            - Generous stock options.""",
            "team_size": "15-30",
            "interview_process": """1. **HR Screening** - Initial chat about experience and role fit.
            2. **Technical Cloud Infrastructure Test** - Hands-on AWS and Kubernetes tasks.
            3. **System Design Interview** - Design a scalable cloud architecture.
            4. **Final Round with CTO** - Leadership and future growth discussions.""",
            "num_of_questions": 12,
            "difficulty_level": "Advanced",
            "valid_through_start": date(2025, 4, 10),
            "valid_through_end": date(2025, 12, 31),
            "include_dsa_questions": True,
            "num_of_dsa_questions": 6,
            "include_predefined_questions": True,
            "predefined_questions_list": "Explain Kubernetes autoscaling mechanisms.",
            "eligibility_criteria": "Experience in DevOps and Cloud Computing",
            "eligibility_threshold": 80,
            "job_roles": "DevOps Engineer, Cloud Architect, Site Reliability Engineer"
        },
        {
        "company_id": companies["GreenTech Solutions"].company_id,
        "job_title": "Renewable Energy Engineer",
        "experience": 5,
        "salary": 125000,
        "job_type": JobTypeEnum.on_site,
        "job_location": "San Francisco",
        "posted_date": date(2025, 4, 10),
        "application_deadline": date(2025, 6, 30),
        "job_description": """GreenTech Solutions is looking for a Renewable Energy Engineer to develop and implement sustainable energy solutions.
        The ideal candidate will work on designing solar and wind power systems while optimizing energy efficiency.""",
        "responsibilities": """- Design and implement renewable energy systems.
        - Conduct feasibility studies for solar and wind farms.
        - Analyze energy efficiency and propose improvements.
        - Collaborate with city planners and government agencies.""",
        "requirements": """- Bachelor's or Master's degree in Renewable Energy Engineering.
        - Strong understanding of solar and wind energy technologies.
        - Experience with energy storage solutions.
        - Knowledge of government policies and incentives for renewable energy.""",
        "benefits": """- Stock options and performance bonuses.
        - Professional development and training.
        - Company-sponsored sustainability initiatives.""",
        "team_size": "20-30",
        "interview_process": """1. **Initial Screening** - Phone interview with HR.
        2. **Technical Assessment** - Renewable energy case study.
        3. **Project Presentation** - Present a past project on energy efficiency.
        4. **Panel Interview** - Discussion with senior engineers and executives.""",
        "num_of_questions": 12,
        "difficulty_level": "Advanced",
        "valid_through_start": date(2025, 4, 15),
        "valid_through_end": date(2025, 12, 31),
        "include_dsa_questions": False,
        "num_of_dsa_questions": None,
        "include_predefined_questions": True,
        "predefined_questions_list": "Explain the efficiency of different solar panel technologies.",
        "eligibility_criteria": "Bachelor's degree in Renewable Energy or equivalent experience",
        "eligibility_threshold": 80,
        "job_roles": "Renewable Energy Engineer, Sustainability Consultant, Energy Analyst"
    },
    {
        "company_id": companies["CyberShield"].company_id,
        "job_title": "Cloud Security Engineer",
        "experience": 4,
        "salary": 140000,
        "job_type": JobTypeEnum.hybrid,
        "job_location": "Chicago",
        "posted_date": date(2025, 4, 15),
        "application_deadline": date(2025, 7, 1),
        "job_description": """CyberShield is hiring a Cloud Security Engineer to secure cloud infrastructure and ensure compliance with industry security standards.
        This role involves working with AWS, Azure, and GCP security services to protect enterprise systems.""",
        "responsibilities": """- Implement cloud security best practices.
        - Monitor and prevent security threats in cloud environments.
        - Design and enforce security policies for cloud-native applications.
        - Conduct security audits and penetration tests.""",
        "requirements": """- Strong experience with AWS, Azure, or Google Cloud security tools.
        - Understanding of identity and access management (IAM).
        - Experience with SIEM tools for security monitoring.
        - Security certifications (CISSP, CISM, or AWS Security Specialty) are preferred.""",
        "benefits": """- Home office setup stipend.
        - Paid security training and certifications.
        - Flexible hybrid work schedule.""",
        "team_size": "10-20",
        "interview_process": """1. **HR Call** - Basic screening and role discussion.
        2. **Cloud Security Case Study** - Analyze and fix a security breach.
        3. **Technical Deep Dive** - Advanced security concepts discussion.
        4. **Final Executive Interview** - Meet with leadership team.""",
        "num_of_questions": 15,
        "difficulty_level": "Expert",
        "valid_through_start": date(2025, 4, 20),
        "valid_through_end": date(2025, 12, 31),
        "include_dsa_questions": True,
        "num_of_dsa_questions": 5,
        "include_predefined_questions": True,
        "predefined_questions_list": "How would you secure an S3 bucket in AWS?",
        "eligibility_criteria": "Experience in cloud security and compliance",
        "eligibility_threshold": 85,
        "job_roles": "Cloud Security Engineer, DevSecOps Specialist, Cybersecurity Architect"
    },
    {
        "company_id": companies["DataGenix"].company_id,
        "job_title": "Data Science Lead",
        "experience": 6,
        "salary": 160000,
        "job_type": JobTypeEnum.remote,
        "job_location": "Remote",
        "posted_date": date(2025, 4, 20),
        "application_deadline": date(2025, 8, 1),
        "job_description": """DataGenix is looking for a Data Science Lead to oversee AI and ML projects.
        You will guide a team of data scientists in building predictive analytics solutions for enterprise clients.""",
        "responsibilities": """- Lead the development of AI-driven analytics solutions.
        - Mentor junior data scientists and researchers.
        - Deploy ML models into production.
        - Work with stakeholders to define data-driven business strategies.""",
        "requirements": """- PhD or Master's degree in AI/ML, Computer Science, or related field.
        - 6+ years experience in data science and machine learning.
        - Strong knowledge of Python, TensorFlow, and PyTorch.
        - Experience with cloud-based ML deployment (AWS, GCP, Azure).""",
        "benefits": """- Remote work with flexible hours.
        - Annual AI conference sponsorship.
        - High-performance computing (HPC) access for deep learning research.""",
        "team_size": "15-25",
        "interview_process": """1. **HR Call** - General screening and role discussion.
        2. **ML Coding Challenge** - Solve real-world machine learning tasks.
        3. **Research Discussion** - Present a past ML project.
        4. **Final Panel Interview** - Meet with executives and data science leadership.""",
        "num_of_questions": 10,
        "difficulty_level": "Expert",
        "valid_through_start": date(2025, 4, 25),
        "valid_through_end": date(2025, 12, 31),
        "include_dsa_questions": True,
        "num_of_dsa_questions": 7,
        "include_predefined_questions": True,
        "predefined_questions_list": "How do you handle imbalanced datasets in classification problems?",
        "eligibility_criteria": "Advanced degree in AI/ML or 6+ years industry experience",
        "eligibility_threshold": 90,
        "job_roles": "Data Science Lead, AI Researcher, Machine Learning Engineer"
    }
    ]
    
    for job_data in job_services_data:
        create_job_service(db, **job_data)
        print(f"Job added: {job_data['job_title']} at {job_data['job_location']}")
    
    db.close()

if __name__ == "__main__":
    add_sample_data()
