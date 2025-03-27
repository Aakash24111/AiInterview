from langchain.text_splitter import RecursiveCharacterTextSplitter
import asyncio
import faiss
from pathlib import Path
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from app.providers.providers import Providers

class Ingestion:
    def __init__(self):
        self.providers=Providers()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=220,
            chunk_overlap=9,
            length_function=len,
            is_separator_regex=False,
        )

    def create_embeddings(self,documents,id):
        embeddings=self.providers.get_embeddings()
        current_dir = Path(__file__).resolve().parent
        vector_store_path = current_dir.parent / 'vector_store' / 'faiss_index' / f'{id}_embeddings'
        index = faiss.IndexFlatL2(len(embeddings.embed_query("hello world")))
        vector_store = FAISS(
            embedding_function=embeddings,
            index=index,
            docstore=InMemoryDocstore(),
            index_to_docstore_id={},
        )
        vector_store.add_documents(documents)
        vector_store.save_local(str(vector_store_path))
        
    #Data Ingestion
    def load_resume(self,file):
        loader = PyPDFLoader(file)
        async def load_pages():
            pages = []
            async for page in loader.alazy_load():
                pages.append(page)
            return pages
        docs = asyncio.run(load_pages())
        return docs
        
    #Data Chunking and create Embeddings
    def chunking(self,docs,id):
        documents= self.text_splitter.split_documents(docs)
        print(len(documents))
        for document in documents:
            document.metadata['id']=id
        self.create_embeddings(documents,id)
    
    #Create Graph Documents
    # def create_graph_documents(self,docs,user_id):
    #     docs=self.text_splitter.split_documents(docs)
    #     for document in docs:
    #         document.metadata['id']=user_id
    #     graph_documents = self.providers.get_graph_transformer().convert_to_graph_documents(docs)
    #     for docs in graph_documents:
    #         for node in docs.nodes:
    #             node.properties["user_id"] = user_id
    #     self.providers.get_graph().add_graph_documents(graph_documents)
