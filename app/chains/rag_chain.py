from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from app.providers.providers import Providers
from app.company.company_config import Company_Config
from typing import TypedDict,Literal
from operator import itemgetter
from langchain_core.runnables import RunnableLambda
from app.prompts.prompts import condn_prompt , prompt_template , dummy_candidate_prompt
from pydantic import BaseModel
# from langchain.retrievers import ContextualCompressionRetriever
# from langchain.retrievers.document_compressors import LLMChainExtractor

class CheckAttribute(BaseModel):
    attribute: Literal["intro", "work_exp", "skills", "projects","edu"]
    
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
        # self.context=self.faiss_retriever.invoke(f'Retrieve douments regarding candidates {attribute}')
        # self.current_prompt=self.current_prompt.format_prompt(context=self.context)
        # self.chain= self.current_prompt | self.llm 
        chain=create_stuff_documents_chain(llm=self.llm,prompt=prompt_template)
        retriever_chain=create_retrieval_chain(self.faiss_retriever,chain)
        return retriever_chain
    
    def set_prompt(self,prompt):
        self.current_prompt=self.prompts[prompt]    
        
    def get_resume_condition(self,history):
        self.faiss_retriever=self.vector_db.as_retriever(search_type="mmr",
                                     search_kwargs={'k': 11}) 
        self.context=self.faiss_retriever.invoke(f'Retrieve douments regarding candidates background,skills and technologies,projects made by him,his education,his work experience,his extra curricular activities like certifications and competitions.')
        self.condn_chain = condn_prompt | self.llm.with_structured_output(CheckCondition)
        inputs = {
            "job_role": self.company_conf.job_role,
            "job_description": self.company_conf.job_description,
            "context": self.context,
            "history": history
        }
        try:
            response = self.condn_chain.invoke(inputs)
            return response.attribute
        except Exception as e:
            failed = getattr(e, "response", {}).get("error", {}).get("failed_generation", "")
            if '"Yes"' in failed:
                return "Yes"
            elif '"No"' in failed:
                return "No"
            else:
                raise RuntimeError(f"Unhandled failed_generation content: {failed}")