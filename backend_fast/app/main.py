import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from typing import List, Dict, Optional
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import PydanticOutputParser
from app.models import DocumentRequest,ChatRequest,QuizRequest,SummaryResponse,ChatResponse,QuizResponse,ModelChangeRequest
from app.dependencies import model,AVAILABLE_MODELS,selected_model_id

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Validate API Key
if not GROQ_API_KEY:
    raise ValueError("Missing API Key: Set GROQ_API_KEY in .env")

# Initialize FastAPI App
app = FastAPI(title="Learn-Mate API - Dwight Schrute Edition", version="1.2")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this to your frontend URL in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# In-memory storage for extracted documents
extracted_docs_store: Dict[str, Dict[str, str]] = {}

# ------------------------------ Routes ------------------------------ #

@app.get("/")
async def welcome():
    """Welcome route."""
    return {"message": "Welcome to Learn-Mate API! 🚀 Now with 100% more Dwight Schrute logic."}

@app.get("/models")
async def list_available_models():
    """Lists all available models."""
    return {"success": True, "available_models": list(AVAILABLE_MODELS.keys()), "selected_model": selected_model_id}

@app.post("/change-model")
async def change_model(request: ModelChangeRequest):
    """Changes the current LLM model."""
    global model, selected_model_id

    if request.model_id not in AVAILABLE_MODELS:
        raise HTTPException(status_code=400, detail="Invalid model ID. Check /models for available options.")

    selected_model_id = request.model_id
    model = init_chat_model(selected_model_id, model_provider="groq")

    return {"success": True, "message": f"Model changed to {selected_model_id}"}

@app.post("/extract", response_model=SummaryResponse)
async def extract_text(request: DocumentRequest):
    """Extracts text, summarizes it, and stores it for future use."""
    extracted_docs_store["user"] = request.documents  # Store documents in memory
    extracted_text = "\n".join(request.documents.values())

    # Summarization Prompt
    messages = [
        SystemMessage("Summarize the following document text."),
        HumanMessage(extracted_text)
    ]
    summary = model.invoke(messages).content

    # Key Points Extraction
    key_point_prompt = [
        SystemMessage("Extract key points from the document in bullet points."),
        HumanMessage(extracted_text)
    ]
    key_points = model.invoke(key_point_prompt).content.split("\n")

    return SummaryResponse(success=True, summary=summary, key_points=key_points)

@app.post("/chat", response_model=ChatResponse)
async def chat_with_documents(request: ChatRequest):
    """Chat with previously stored documents - only responds based on provided content."""
    documents = extracted_docs_store.get("user")
    if not documents:
        raise HTTPException(status_code=400, detail="No documents available. Extract documents first.")

    extracted_text = "\n".join(documents.values())

    # Improved Prompt: Forces the model to only use the document for responses
    messages = [
        SystemMessage(
            "You are Dwight Schrute from 'The Office.' You must only answer based on the provided document. "
            "If the document does not contain relevant information, clearly say: "
            "'I cannot answer this as it is not covered in the provided text.' "
            "Your responses should be logical, factual, and slightly condescending."
        ),
        HumanMessage(f"Document: {extracted_text}\n\nUser Query: {request.query}")
    ]
    
    response = model.invoke(messages)

    return ChatResponse(success=True, response=response.content)



@app.post("/quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """Generates a multiple-choice quiz based on stored documents, in Dwight Schrute’s style."""
    documents = extracted_docs_store.get("user")
    if not documents:
        raise HTTPException(status_code=400, detail="No documents available. Extract documents first.")

    extracted_text = "\n".join(documents.values())

    # Dwight Schrute Quiz Prompt
    quiz_prompt = [
        SystemMessage(f"You are Dwight Schrute, the ultimate quizmaster. Generate {request.num_questions} multiple-choice questions based on the following document. The questions should be challenging and prove the test taker's intelligence (or lack thereof). Format the response in JSON."),
        HumanMessage(f"Document: {extracted_text}")
    ]
    response = model.invoke(quiz_prompt)

    return QuizResponse(success=True, quiz=response.content)

# ------------------------------ End of Code ------------------------------ #
