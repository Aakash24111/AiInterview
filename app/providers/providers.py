#LLM
from langchain_groq import ChatGroq
from pathlib import Path
#Embeddings
from langchain_huggingface import HuggingFaceEmbeddings
#Vector-Store
from pathlib import Path
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
#KG
# from langchain_neo4j import Neo4jGraph
# from langchain_experimental.graph_transformers import LLMGraphTransformer
#Logging
from app.logger.logger_config import logger
#env
import os 
from dotenv import load_dotenv
# os.environ["NEO4J_URI"] = "bolt://localhost:7687"
# os.environ["NEO4J_USERNAME"] = "neo4j"
# os.environ["NEO4J_PASSWORD"] = "password"

class Providers:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        # self.graph = Neo4jGraph(refresh_schema=False)
        env_path = Path(__file__).resolve().parent.parent / ".env"
        load_dotenv(dotenv_path=env_path, override=True)
        groq_api_key = os.getenv('GROQ_API_KEY')
        self.llm=ChatGroq(model='llama-3.1-8b-instant',api_key=groq_api_key)
        # self.llm_graph_transformer = LLMGraphTransformer(llm=self.llm)
        logger.info("Providers initialised")
        
    # def get_graph(self):
    #     return self.graph
    
    def get_embeddings(self):
        logger.info("Returning Embeddings")
        return self.embeddings
    
    # def get_graph_transformer(self):
    #     return self.llm_graph_transformer
    
    def get_llm(self):
        logger.info("Returning LLM")
        return self.llm
    
    def get_vector_db(self,user_id):
        logger.info(f'Returning vector db for user:{user_id}')
        self.current_dir = Path(__file__).resolve().parent
        self.vector_store_path = self.current_dir.parent / 'vector_store' / 'faiss_index' / f'{user_id}_embeddings'
        self.vector_store = FAISS.load_local(self.vector_store_path, self.embeddings , allow_dangerous_deserialization=True)
        return self.vector_store
    