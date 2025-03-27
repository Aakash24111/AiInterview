from app.ingestion.ingestion import Ingestion
import concurrent.futures

class User:
    def __init__(self,user_id,user_resume):
        self.user_id=user_id
        self.user_resume=user_resume
        self.ingestion=Ingestion()
        
    def create_user_vector_embeddings(self):
        file=self.user_resume
        id=self.user_id
        docs=self.ingestion.load_resume(file=file)
        self.ingestion.chunking(docs=docs,id=id)

    def create_user_kg_data(self):
        file=self.user_resume
        id=self.user_id
        docs=self.ingestion.load_resume(file=file)
        self.ingestion.create_graph_documents(docs=docs,user_id=id)
    
    def create_user_data(self):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future1 = executor.submit(self.create_user_vector_embeddings)
            future2 = executor.submit(self.create_user_kg_data)
            concurrent.futures.wait([future1, future2])

# user_veer=User(62,'D:/VARS/app/Veer_Resume.pdf')
# user_jatush=User(57,'D:/VARS/app/Jatush_Resume.pdf')
user_aakash=User(56,'D:/VARS/app/Aakash_Resume.pdf')
user_ruturaj=User(59,'D:/VARS/app/Ruturaj_Resume.pdf')
# user_jatush.create_user_kg_data()
user_aakash.create_user_data()
user_ruturaj.create_user_data()