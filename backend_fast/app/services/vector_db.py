import os
from langchain.vectorstores import Chroma, Pinecone
from langchain.embeddings import OpenAIEmbeddings
from app.config import config

class VectorDB:
    def __init__(self):
        self.embedding_model = OpenAIEmbeddings()
        if config.VECTOR_DB == "chroma":
            self.db = Chroma(persist_directory="./chroma_db", embedding_function=self.embedding_model)
        else:
            import pinecone
            pinecone.init(api_key=config.PINECONE_API_KEY, environment=config.PINECONE_ENV)
            self.db = Pinecone(index_name="document-index", embedding_function=self.embedding_model)

    def store_embeddings(self, user_id, docs):
        texts = list(docs.values())
        metadatas = [{"user_id": user_id, "doc_name": name} for name in docs.keys()]
        self.db.add_texts(texts=texts, metadatas=metadatas)

    def retrieve_relevant_docs(self, user_id, query):
        results = self.db.similarity_search(query, k=3, filter={"user_id": user_id})
        return [res.page_content for res in results]
