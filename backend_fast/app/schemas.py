from typing import Dict, List, Optional
from pydantic import BaseModel

class User(BaseModel):
    """Pydantic User Schema for Request Validation"""
    name: str
    email: str
    password: str
    Docs: Optional[Dict[str, str]] = {}
    summary: Optional[str] = ""
    key_points: Optional[List[str]] = []
    model_id: Optional[str] = "llama3-8b-8192"
    chatHistory: List[Dict[str, str]] = []
    totalUsage: Optional[Dict[str, int]] = {
        "chats": 0,
        "uploads": 0,
        "quizzesGenerated": 0,
    }
