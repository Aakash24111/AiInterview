from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from app.providers.providers import Providers
from app.company.company_config import Company_Config
from typing import TypedDict,Literal
from operator import itemgetter
from langchain_core.runnables import RunnableLambda
from app.prompts.prompts import condn_prompt , prompt_template , dummy_candidate_prompt , attr_prompt
from pydantic import BaseModel
from app.logger.logger_config import logger
# from langchain.retrievers import ContextualCompressionRetriever
# from langchain.retrievers.document_compressors import LLMChainExtractor

class CheckAttribute(BaseModel):
    attribute: Literal["work_exp", "skills", "projects","edu"]
    
class CheckCondition(BaseModel):
    attribute: Literal["Yes","No"]

class RAG:
    def __init__(self,user_id,company_id):
        self.company_conf=Company_Config(company_id)
        self.providers=Providers()
        self.llm=self.providers.get_llm()
        self.vector_db=self.providers.get_vector_db(user_id)
        self.prompts=self.company_conf.get_prompts()
        self.current_prompt=self.prompts['intro']
        self.current_topic=list(self.prompts.keys())[0]
        logger.info("RAG Class initialised.")
        logger.info(f'current_prompt={self.current_prompt}')
        logger.info(f'current_topic={self.current_topic}')

    def get_dummy_candidate(self,question):
        self.faiss_retriever=self.vector_db.as_retriever(search_type="mmr",
                                     search_kwargs={'k': 11})  
        self.candidate_chain=create_stuff_documents_chain(llm=self.llm,prompt=dummy_candidate_prompt)
        self.candidate_response=create_retrieval_chain(self.faiss_retriever,self.candidate_chain)
        inputs = {
            "job_role":self.company_conf.job_role,
            "company_name":self.company_conf.company_name,
            "input":question
        }
        return self.candidate_response,inputs
        
    def get_rag_chain(self):
        self.faiss_retriever=self.vector_db.as_retriever(search_type="mmr",
                                     search_kwargs={'k': 7})  
        logger.debug("Returning RAG Chain")
        logger.debug(f'current topic={self.current_topic}')
        logger.debug(f'current topic={self.current_prompt}')
        if self.current_topic=="work_exp":
            self.context=self.faiss_retriever.invoke(f'Retrieve douments regarding candidates work experience , internships and other jobs.')
        elif self.current_topic=="project":
            self.context=self.faiss_retriever.invoke(f'Retrieve douments regarding all the projects made by the candidate along with the description and project name.')
        elif self.current_topic=="edu":
            self.context=self.faiss_retriever.invoke(f'Retrieve douments regarding candidate\'s education,academics,extra curricular activities,competitions,hackathons or certifications.')
        elif self.current_topic=="intro":
            self.context=self.faiss_retriever.invoke(f'Retrieve douments regarding candidate\'s background , general details like name , etc , and overview and his interests and passion.')
        else:
            self.context=self.faiss_retriever.invoke(f'Retrieve douments regarding candidate\'s skill set and technology stack and his proeficient tools.')
        # logger.info(f'Retrived docs={self.context}')
        inputs={"context":self.context} 
        # self.current_prompt=self.current_prompt.format_prompt(context=self.context)
        self.chain= self.current_prompt | self.llm 
        self.response=self.chain.invoke(inputs)
        # chain=create_stuff_documents_chain(llm=self.llm,prompt=self.current_prompt)
        # retriever_chain=create_retrieval_chain(self.faiss_retriever,chain)
        return self.response.content
    
    def set_prompt(self,prompt,history,summary):
        logger.debug('Setting Prompt and Topic...')
        self.current_topic=prompt
        logger.debug(f'Set current topic to={self.current_topic}')
        self.current_prompt=self.prompts[prompt] 
        logger.debug(f'Set current prompt to={self.current_prompt}')
        self.current_prompt.partial(history=history,summary=summary,topic=self.current_topic)  
    
    def get_attr_condn(self,summary,history):
        logger.debug("Setting up attribute...")
        self.faiss_retriever=self.vector_db.as_retriever(search_type="mmr",
                                     search_kwargs={'k': 11}) 
        self.context=self.faiss_retriever.invoke(f'Retrieve all douments regarding candidates background,skills and technologies,projects made by him,his education,his work experience,his extra curricular activities like certifications and competitions.')
        inputs={
            "context":self.context,
            "history":history,
            "summary":summary,
            "topic":self.current_topic
        }
        self.attr_chain = self.prompts['attr'] | self.llm.with_structured_output(CheckAttribute)
        try:
            response = self.attr_chain.invoke(inputs)
            return response.attribute
        except Exception as e:
            failed_response = getattr(e, "response", None)

            if failed_response:
                try:
                    error_details = failed_response.json()
                except AttributeError:
                    error_details = str(failed_response)
                failed_generation = error_details.get("error", {}).get("failed_generation", "")

                # Check for expected values
                if '"skills"' in failed_generation or '"attribute": "skills"' in failed_generation:
                    return "skills"
                elif '"edu"' in failed_generation or '"attribute": "edu"' in failed_generation:
                    return "edu"
                elif '"work_exp"' in failed_generation or '"attribute": "work_exp"' in failed_generation:
                    return "work_exp"
                elif '"projects"' in failed_generation or '"attribute": "projects"' in failed_generation:
                    return "projects"
            raise RuntimeError(f"Unhandled failed_generation content: {failed_generation}")

            
        
    def get_resume_condition(self,sumary,history):
        self.faiss_retriever=self.vector_db.as_retriever(search_type="mmr",
                                     search_kwargs={'k': 11}) 
        self.context=self.faiss_retriever.invoke(f'Retrieve all douments regarding candidates background,skills and technologies,projects made by him,his education,his work experience,his extra curricular activities like certifications and competitions.')
        self.condn_chain = self.prompts['condn'] | self.llm.with_structured_output(CheckCondition)
        inputs = {
            "summary":sumary,
            "context": self.context,
            "history": history
        }
        try:
            response = self.condn_chain.invoke(inputs)
            return response.attribute
        except Exception as e:
            failed_response = getattr(e, "response", None)

            if failed_response:
                try:
                    error_details = failed_response.json() 
                except AttributeError:
                    error_details = str(failed_response) 
                
                failed_generation = error_details.get("error", {}).get("failed_generation", "")
                if '"Yes"' in failed_generation or '"attribute": "Yes"' in failed_generation:
                    return "Yes"
                elif '"No"' in failed_generation or '"attribute": "No"' in failed_generation:
                    return "No"
        
    def generate_summary(self,context,history):
        self.temp_prompt=self.prompts['summ']
        self.summary_chain=self.temp_prompt | self.llm
        self.summary=self.summary_chain.invoke({"context":context,"history":history})
        return self.summary.content
        
        