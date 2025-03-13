import os
from bson import ObjectId
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Dict

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
    """Chat with previously stored documents and save chat history in MongoDB using `user_id`."""
    documents = extracted_docs_store.get(request.user_id)
    if not documents:
        raise HTTPException(status_code=400, detail="No documents available. Extract documents first.")

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
    chat_entry = {"question": request.query, "answer": response}
    await users_collection.update_one(
        {"_id": ObjectId(request.user_id)},
        {"$push": {"chatHistory": chat_entry}},
        upsert=True
    )

    return ChatResponse(success=True, response=response)

#---------------------------------------------------

@app.post("/quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """Generates a multiple-choice quiz based on stored documents, in Dwight Schrute’s style."""
    documents = extracted_docs_store.get(request.user_id)
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