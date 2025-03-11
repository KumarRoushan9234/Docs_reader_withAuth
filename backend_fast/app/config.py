import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Validate API Key
if not GROQ_API_KEY:
    raise ValueError("Missing API Key: Set GROQ_API_KEY in .env")

# class Config:
#     GROQ_API_KEY = os.getenv("GROQ_API_KEY")
#     PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
#     PINECONE_ENV = os.getenv("PINECONE_ENV")
#     VECTOR_DB = os.getenv("VECTOR_DB", "chroma")  
#     # Default to ChromaDB

# config = Config()
