from typing import List, Dict
from pydantic import BaseModel, Field

# ------------------------------ Pydantic Models ------------------------------ #

class DocumentRequest(BaseModel):
    """Request model for document processing."""
    user_id: str = Field(..., description="Unique identifier for the user.")
    documents: Dict[str, str] = Field(..., description="Mapping of document IDs to their extracted text.")

class ChatRequest(BaseModel):
    """Request model for chatting with stored documents."""
    user_id: str = Field(..., description="Unique identifier for the user.")
    query: str = Field(..., description="User's question for the AI.")

class QuizRequest(BaseModel):
    """Request model for quiz generation based on stored documents."""
    user_id:str
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
    success: bool = Field(..., description="Indicates if the quiz was generated successfully.")
    quiz: str = Field(..., description="Generated multiple-choice questions in JSON format.")

class ModelChangeRequest(BaseModel):
    """Request model to change the active LLM model."""
    user_id: str = Field(..., description="Unique identifier for the user.")
    model_id: str = Field(..., description="ID of the new LLM model to use.")
