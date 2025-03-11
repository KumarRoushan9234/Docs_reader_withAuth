from langchain.chat_models import init_chat_model
from app.config import GROQ_API_KEY

# Supported Models
AVAILABLE_MODELS = {
    "distil-whisper-large-v3-en": "HuggingFace",
    "gemma2-9b-it": "Google",
    "llama-3.3-70b-versatile": "Meta",
    "llama-3.1-8b-instant": "Meta",
    "llama-guard-3-8b": "Meta",
    "llama3-70b-8192": "Meta",
    "llama3-8b-8192": "Meta",
    "mixtral-8x7b-32768": "Mistral",
    "whisper-large-v3": "OpenAI",
    "whisper-large-v3-turbo": "OpenAI"
}

# Default Model
selected_model_id = "llama3-8b-8192"
model = init_chat_model(selected_model_id, model_provider="groq")
