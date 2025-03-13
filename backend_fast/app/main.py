import os
import json
from datetime import datetime
from bson import ObjectId
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import List, Optional,Dict
from pydantic import BaseModel, Field

from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, SystemMessage

from app.models import (
    DocumentRequest, ChatRequest, QuizRequest,
    SummaryResponse, ChatResponse, QuizResponse, ModelChangeRequest
)
from app.dependencies import model, AVAILABLE_MODELS, selected_model_id

from motor.motor_asyncio import AsyncIOMotorClient

#---------------------------------------------------

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Validate API Key
if not GROQ_API_KEY:
    raise ValueError("Missing API Key: Set GROQ_API_KEY in .env")

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DATABASE_NAME")]
users_collection = db["users"]

# Initialize FastAPI App
app = FastAPI(title="Learn-Mate API - Dwight Schrute Edition", version="1.2")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
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

#---------------------------------------------------
@app.post("/change-model")
async def change_model(request: ModelChangeRequest):
    """Changes the LLM model for an existing user and returns updated user details."""
    global model, selected_model_id

    try:
        user_id_obj = ObjectId(request.user_id)  # Convert user_id to ObjectId
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    # Find the user using `_id`
    user = await users_collection.find_one({"_id": user_id_obj})

    if not user:
        raise HTTPException(status_code=404, detail="User not found. Please register first.")

    if request.model_id not in AVAILABLE_MODELS:
        raise HTTPException(status_code=400, detail="Invalid model ID. Check /models for available options.")

    # Update model_id in MongoDB
    await users_collection.update_one(
        {"_id": user_id_obj},
        {"$set": {"model_id": request.model_id}}
    )

    # Update in-memory model selection
    selected_model_id = request.model_id
    model = init_chat_model(selected_model_id, model_provider="groq")

    # Fetch updated user details
    updated_user = await users_collection.find_one({"_id": user_id_obj})

    return {
        "success": True,
        "message": f"Model changed to {selected_model_id}",
        "user_details": {
            "user_id": str(updated_user["_id"]),  # Convert ObjectId to string
            "name": updated_user.get("name"),
            "email": updated_user.get("email"),
            "model_id": updated_user.get("model_id"),
            "settings": updated_user.get("settings"),
            "totalUsage": updated_user.get("totalUsage"),
        }
    }
#---------------------------------------------------

class ExtractRequest(BaseModel):
    user_id: str  # User ID as a string
    docs: dict  # New extracted documents
    
@app.post("/extract")
async def extract_text(data: ExtractRequest):
    try:
        # Convert user_id to ObjectId
        user_oid = ObjectId(data.user_id)

        # Find user in DB
        user = await users_collection.find_one({"_id": user_oid})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Update Docs
        new_docs = data.docs
        extracted_text = "\n".join(new_docs.values())  # Merge docs for LLM input

        # Generate Summary
        summary_prompt = [
            SystemMessage("Summarize the following document text."),
            HumanMessage(extracted_text)
        ]
        summary = model.invoke(summary_prompt).content

        # Extract Key Points
        key_point_prompt = [
            SystemMessage("Extract key points from the document in bullet points."),
            HumanMessage(extracted_text)
        ]
        key_points = model.invoke(key_point_prompt).content.split("\n")

        # Update MongoDB
        await users_collection.update_one(
            {"_id": user_oid},
            {"$set": {"Docs": new_docs, "summary": summary, "key_points": key_points}}
        )

        # Return response
        return {
            "success": True,
            "message": "Documents updated successfully",
            "summary": summary,
            "key_points": key_points
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#---------------------------------------------------

@app.post("/chat", response_model=ChatResponse)
async def chat_with_documents(request: ChatRequest):
    """Chat with stored documents and save chat history in MongoDB."""
    try:
        user_id_obj = ObjectId(request.user_id)

        # Fetch user data
        user = await users_collection.find_one({"_id": user_id_obj})
        if not user:
            raise HTTPException(status_code=404, detail="User not found. Please register first.")

        documents = user.get("Docs", {})
        if not documents:
            raise HTTPException(status_code=400, detail="No documents found. Upload documents first.")

        extracted_text = "\n".join(documents.values())

        # Chat Prompt
        messages = [
            SystemMessage(
                "You are Dwight Schrute from 'The Office.' You must only answer based on the provided document. "
                "If the document does not contain relevant information, clearly say: "
                "'I cannot answer this as it is not covered in the provided text.' "
                "Your responses should be logical, factual, and slightly condescending."
            ),
            HumanMessage(f"Document: {extracted_text}\n\nUser Query: {request.query}")
        ]

        response = model.invoke(messages).content

        # Store chat in MongoDB
        chat_entry = {
            "question": request.query,
            "answer": response,
            "timestamp": datetime.now()
        }
        await users_collection.update_one(
            {"_id": user_id_obj},
            {
                "$push": {"chatHistory": chat_entry},
                "$inc": {"totalUsage.chats": 1}
            }
        )

        return ChatResponse(success=True, response=response)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#---------------------------------------------------
# **Define Pydantic Models for Validation**


class QuizQuestion(BaseModel):
    question: str = Field(..., description="The question text")
    type: str = Field(..., description="Type of question (e.g., 'multiple choice')")
    options: List[str] = Field(..., description="List of answer choices")
    answer: str = Field(..., description="Correct answer")
    difficulty: str = Field(..., description="Difficulty level (easy, medium, hard)")
    hints: Optional[List[str]] = Field(default=None, description="Hints for the question")

# Pydantic Schema for Quiz Response
class QuizResponse(BaseModel):
    questions: List[QuizQuestion] = Field(..., description="List of generated quiz questions")

# Request Schema
class QuizRequest(BaseModel):
    user_id: str = Field(..., description="User ID from the database")
    num_questions: int = Field(..., description="Number of questions to generate")
    user_message: str = Field(..., description="User request for quiz customization")

@app.post("/quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """Generates a structured multiple-choice quiz based on stored documents and user request => saves to MongoDB."""
    try:
        user_id_obj = ObjectId(request.user_id)

        # Fetch user data
        user = await users_collection.find_one({"_id": user_id_obj})
        if not user:
            raise HTTPException(status_code=404, detail="User not found. Please register first.")

        documents = user.get("Docs", {})
        if not documents:
            raise HTTPException(status_code=400, detail="No documents found. Upload documents first.")

        extracted_text = "\n".join(documents.values())

        # **Quiz Prompt enforcing JSON structure with user_message included**
        quiz_prompt = [
            SystemMessage(
                f"""You are an AI quiz generator. Your task is to generate exactly {request.num_questions} multiple-choice questions.
                - Each question must follow this JSON format:
                {{
                  "questions": [
                    {{
                      "question": "What is Schrute Bucks?",
                      "type": "multiple choice",
                      "options": ["A currency", "A vegetable", "A spaceship", "A car"],
                      "answer": "A currency",
                      "difficulty": "medium",
                      "hints": ["Used by Dwight in The Office"]
                    }},
                    ...exactly {request.num_questions} questions...
                  ]
                }}
                - Ensure that the response contains **exactly {request.num_questions} questions**.
                - The questions should be based on both the provided document and the user's request.
                - Avoid generating fewer than {request.num_questions} questions.
                """
            ),
            HumanMessage(f"Document: {extracted_text}"),
            HumanMessage(f"User Request: {request.user_message}")
        ]


        # Call the model and enforce structured output
        structured_llm = model.with_structured_output(QuizResponse)
        quiz_data = structured_llm.invoke(quiz_prompt)

        # Store quiz in MongoDB
        quiz_entry = {
            "quiz": quiz_data.dict(),  # Convert Pydantic object to dict
            "timestamp": datetime.now()
        }
        await users_collection.update_one(
            {"_id": user_id_obj},
            {
                "$push": {"quizzesGenerated": quiz_entry},
                "$inc": {"totalUsage.quizzesGenerated": 1}
            }
        )

        return quiz_data  # Directly return Pydantic-validated response

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="LLM returned invalid JSON.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#---------------------------------------------------

@app.delete("/delete-model")
async def delete_model(request: ModelChangeRequest):
    """Deletes the model reference for a user in MongoDB using `user_id`."""
    try:
        user_id_obj = ObjectId(request.user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    user = await users_collection.find_one({"_id": user_id_obj})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await users_collection.update_one(
        {"_id": user_id_obj},
        {"$unset": {"model_id": ""}}
    )

    return {"success": True, "message": "Model deleted successfully."}

# ------------------------------ End of Code ------------------------------ #