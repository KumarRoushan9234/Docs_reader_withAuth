import os
from dotenv import load_dotenv
from pymongo import MongoClient
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Validate API Key
if not GROQ_API_KEY:
    raise ValueError("Missing API Key: Set GROQ_API_KEY in .env")

client = MongoClient(os.getenv("MONGODB_URI"))
db = client.Doc_Reader

def get_db():
    return db
