from typing import Dict, List, Optional
from pydantic import BaseModel

class User(BaseModel):
    """MongoDB User Schema"""
    name: str
    email: str
    password: str
    Docs: Optional[Dict[str, str]] = {}
    model_id: Optional[str] = "llama-3.1-8b-instant"
    chatHistory: List[Dict[str, str]] = []
