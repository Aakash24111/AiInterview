from app.prompts.prompts import (
    skills_prompt,projects_prompt,work_exp_prompt,education_prompt,introduction_prompt,summary_prompt,condn_prompt,attr_prompt
)
from app.logger.logger_config import logger

class Company_Config:
    def __init__(self,company_id):
        self.comany_id=company_id
        self.company_name="Amazon"
        self.company_description='''
        Amazon is a global tech company that provides developers with robust cloud infrastructure through AWS, offering services like compute, storage, and AI/ML tools. It supports scalable and secure application development with tools like Lambda (serverless), EC2 (virtual servers), and DynamoDB (NoSQL database). Amazon’s API-driven ecosystem and SDKs enable seamless integration across multiple platforms and languages. It fosters innovation through services like SageMaker for machine learning and Amplify for frontend and mobile app development. With DevOps tools like CodePipeline and CloudFormation, Amazon empowers developers to automate, deploy, and manage infrastructure efficiently.
        '''
        self.job_role="Backend Developer"
        self.job_description='''
        We are looking for a skilled Backend Developer to design, develop, and maintain scalable and high-performance backend systems. You will work on distributed services, RESTful APIs, and cloud-native applications that power Amazon's global platforms. Collaboration with cross-functional teams to deliver reliable, secure, and efficient solutions is essential.
            Requirements:
            1)Strong proficiency in Java, Python, or other backend languages
            2)Experience with RESTful APIs, microservices, and distributed systems
            3)Familiarity with AWS services (e.g., EC2, S3, Lambda, DynamoDB)
            4)Solid understanding of data structures, algorithms, and system design
            5)Bachelor's degree in Computer Science or related field; Master's preferred
        '''
        self.intro_prompt=introduction_prompt.partial(company_name=self.company_name,job_role=self.job_role,
                                                      job_description=self.job_description,company_description=self.company_description)
        self.skills_prompt=skills_prompt.partial(company_name=self.company_name,job_role=self.job_role,job_description=self.job_description)
        self.edu_prompt=education_prompt.partial(company_name=self.company_name,job_role=self.job_role,job_description=self.job_description)
        self.work_exp_prompt=work_exp_prompt.partial(company_name=self.company_name,job_role=self.job_role,job_description=self.job_description)
        self.projects_prompt=projects_prompt.partial(company_name=self.company_name,job_role=self.job_role,job_description=self.job_description)
        self.summary_prompt=summary_prompt.partial(job_role=self.job_role,company_name=self.company_name)
        self.condn_prompt=condn_prompt.partial(job_role=self.job_role,job_description=self.job_description)
        self.attr_prompt=attr_prompt.partial(job_role=self.job_role,job_description=self.job_description)
        logger.info(f'Company-{company_id} Initialised')
        
    def get_prompts(self):
        logger.info("Returning prompts")
        return {
            "intro":self.intro_prompt,
            "skills":self.skills_prompt,
            "edu":self.edu_prompt,
            "projects":self.projects_prompt,
            "work_exp":self.work_exp_prompt,
            "summ":self.summary_prompt,
            "condn":self.condn_prompt,
            "attr":self.attr_prompt
        }