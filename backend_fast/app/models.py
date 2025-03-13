from typing import List, Dict, Optional
from pydantic import BaseModel, Field


# ------------------------------ Pydantic Models ------------------------------ #

class DocumentRequest(BaseModel):
    user_id: str
    documents: Dict[str, str]  # Dictionary of document ID to text

class ChatRequest(BaseModel):
    """Request model for chatting with stored documents."""
    query: str = Field(..., description="User's question for the AI.")

class QuizRequest(BaseModel):
    """Request model for quiz generation based on stored documents."""
    num_questions: int = Field(10, description="Number of quiz questions to generate.")

class SummaryResponse(BaseModel):
    """Structured response containing summary and key points."""
    success: bool = Field(..., description="Indicates if the operation was successful.")
    summary: str = Field(..., description="A short summary of the provided document.")
    key_points: List[str] = Field(..., description="List of extracted key points.")

class ChatResponse(BaseModel):
    """Structured response for chat queries."""
    success: bool = Field(..., description="Indicates if the chat was successful.")
    response: str = Field(..., description="AI-generated response.")

class QuizResponse(BaseModel):
    """Structured response for quiz generation."""
    success: bool = Field(..., description="Indicates if the quiz was successfully generated.")
    quiz: str = Field(..., description="Generated multiple-choice questions in JSON format.")

class ModelChangeRequest(BaseModel):
    """Request model to change the active LLM model."""
    user_id: str
    model_id: str