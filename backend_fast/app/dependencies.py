from langchain.chat_models import init_chat_model
from app.config import GROQ_API_KEY

# Supported Models
AVAILABLE_MODELS = {
    "distil-whisper-large-v3-en": {
        "owner": "HuggingFace",
        "parameters": "Unknown (Distilled version of Whisper Large V3)",
        "best_for": "Speech-to-text transcription with faster inference due to distillation."
    },
    "gemma2-9b-it": {
        "owner": "Google",
        "parameters": "9B",
        "best_for": "General-purpose AI tasks, including text generation, coding, and reasoning."
    },
    "llama-3.3-70b-versatile": {
        "owner": "Meta",
        "parameters": "70B",
        "best_for": "Highly capable text generation, reasoning, and complex NLP tasks."
    },
    "llama-3.1-8b-instant": {
        "owner": "Meta",
        "parameters": "8B",
        "best_for": "Fast text generation and reasoning, optimized for low-latency applications."
    },
    "llama-guard-3-8b": {
        "owner": "Meta",
        "parameters": "8B",
        "best_for": "Content moderation and safety filtering in AI applications."
    },
    "llama3-70b-8192": {
        "owner": "Meta",
        "parameters": "70B",
        "best_for": "Advanced text-based applications requiring high reasoning ability and creativity."
    },
    "llama3-8b-8192": {
        "owner": "Meta",
        "parameters": "8B",
        "best_for": "Mid-tier AI tasks with a balance between speed and intelligence."
    },
    "mixtral-8x7b-32768": {
        "owner": "Mistral",
        "parameters": "8x7B (Sparse Mixture of Experts, 2 active per query)",
        "best_for": "Highly efficient, multi-tasking AI with strong performance in text generation and reasoning."
    },
    "whisper-large-v3": {
        "owner": "OpenAI",
        "parameters": "Unknown (Large model)",
        "best_for": "High-quality speech-to-text transcription with support for multiple languages."
    },
    "whisper-large-v3-turbo": {
        "owner": "OpenAI",
        "parameters": "Unknown (Optimized for speed)",
        "best_for": "Fast and efficient speech recognition, with slightly lower accuracy than Whisper Large V3."
    }
}


# Default Model
selected_model_id = "llama3-8b-8192"
model = init_chat_model(selected_model_id, model_provider="groq")
