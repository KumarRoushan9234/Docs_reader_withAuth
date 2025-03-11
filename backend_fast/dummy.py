from fastapi import FastAPI
from app.routes import extract, chat, quiz

app = FastAPI()

app.include_router(extract.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(quiz.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the LLM-powered chatbot API LEARN_MATE!"}


# pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
# print(pc)
# app = FastAPI(title="LLM-Powered Document Chatbot")




# if not os.getenv("GROQ_API_KEY"):
#   os.environ["GROQ_API_KEY"] = getpass.getpass("Enter API key for Groq: ")

# from langchain.chat_models import init_chat_model

# model = init_chat_model("llama3-8b-8192", model_provider="groq")

# from langchain_core.messages import HumanMessage

# from langchain_core.messages import AIMessage

# print(
#   model.invoke(
#     [
#         HumanMessage(content="Hi! I'm Bob"),
#         AIMessage(content="Hello Bob! How can I assist you today?"),
#         HumanMessage(content="What's my name?"),
#     ]
# ))

# Include routes
# app.include_router(upload_router, prefix="/upload")
# app.include_router(model_router, prefix="/model")
# app.include_router(chat_router, prefix="/chat")
# app.include_router(quiz_router, prefix="/quiz")

# -----------------------------------------------------------------------
import os
import json
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_community.chat_models import ChatGroq  # Fix ChatGroq import
from langchain_community.vectorstores import Chroma  # Fix Chroma import
from langchain.schema import Document
from typing import Dict, List

# Load environment variables
load_dotenv()

# Get API keys from .env file
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Validate API keys
if not GROQ_API_KEY or not GOOGLE_API_KEY:
    raise ValueError("Missing API keys. Set GROQ_API_KEY and GOOGLE_API_KEY in .env")

# Initialize FastAPI app
app = FastAPI(title="LLM Document Chat & Quiz API", version="1.0")

# Initialize Embeddings & Vector Database (ChromaDB)
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
vector_store = Chroma(embedding_function=embeddings)

# Initialize LLM for Chat
llm = ChatGroq(model="llama3-8b-8192", api_key=GROQ_API_KEY)

# In-memory storage for extracted documents
docs_store: Dict[str, Dict[str, str]] = {}

# Conversation memory for multi-user chat history
user_histories: Dict[str, ConversationBufferMemory] = {}


# 🚀 Request Model for Document Upload
class DocRequest(BaseModel):
    documents: Dict[str, str]  # {"doc_name": "extracted text"}


# 🚀 Request Model for Chat
class ChatRequest(BaseModel):
    user_id: str
    message: str


# 🚀 Request Model for Quiz
class QuizRequest(BaseModel):
    user_id: str
    difficulty: str  # easy, medium, hard

@app.get("/")
async def Hello(data: QuizRequest):
    print("hello world")

# 1️⃣ 📌 **Extract & Summarize Documents**
@app.post("/extract")
async def extract_text(data: DocRequest):
    global docs_store

    for doc_name, content in data.documents.items():
        # Store extracted text
        docs_store[doc_name] = {"content": content}

        # Generate summary & key points using LLM
        summary_prompt = f"Summarize the following document and provide key points:\n\n{content}"
        response = llm.invoke(summary_prompt)
        docs_store[doc_name]["summary"] = response.content

        # Store in vector database
        doc = Document(page_content=content, metadata={"source": doc_name})
        vector_store.add_documents([doc])

    return {"success": True, "message": "Documents extracted and summarized!", "data": docs_store}


# 2️⃣ 📌 **Chat with the LLM Based on Uploaded Documents**
@app.post("/chat")
async def chat_with_docs(data: ChatRequest):
    user_id = data.user_id
    message = data.message

    # Ensure user history exists
    if user_id not in user_histories:
        user_histories[user_id] = ConversationBufferMemory()

    # Retrieve relevant documents
    retriever = vector_store.as_retriever()
    qa_chain = ConversationalRetrievalChain.from_llm(
        llm, retriever=retriever, memory=user_histories[user_id]
    )

    # Generate response
    response = qa_chain.run(message)

    return {"success": True, "message": "Chat response generated!", "data": response}


# 3️⃣ 📌 **Generate Quiz Based on Documents**
@app.post("/quiz")
async def generate_quiz(data: QuizRequest):
    user_id = data.user_id
    difficulty = data.difficulty.lower()

    # Check if difficulty level is valid
    if difficulty not in ["easy", "medium", "hard"]:
        raise HTTPException(status_code=400, detail="Invalid difficulty level. Choose 'easy', 'medium', or 'hard'.")

    # Combine all stored document text
    combined_text = " ".join([docs_store[doc]["content"] for doc in docs_store])

    # Generate quiz questions
    quiz_prompt = f"Generate 20-30 {difficulty} difficulty quiz questions based on the following content:\n\n{combined_text}"
    response = llm.invoke(quiz_prompt)

    # Format quiz into JSON structure
    quiz_data = {
        "difficulty": difficulty,
        "questions": response.content.strip().split("\n")
    }

    return {"success": True, "message": "Quiz generated!", "data": quiz_data}


# 🚀 **Run the FastAPI App**
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
