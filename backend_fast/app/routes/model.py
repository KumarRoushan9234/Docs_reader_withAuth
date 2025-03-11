from fastapi import APIRouter, HTTPException
from app.models import ModelChangeRequest
# from app.models.request_models import ModelChangeRequest
from app.dependencies import AVAILABLE_MODELS, model, selected_model_id

router = APIRouter()

@router.get("/models")
async def list_available_models():
    """Lists all available models."""
    return {"success": True, "available_models": list(AVAILABLE_MODELS.keys()), "selected_model": selected_model_id}

@router.post("/change-model")
async def change_model(request: ModelChangeRequest):
    """Changes the current LLM model."""
    global model, selected_model_id

    if request.model_id not in AVAILABLE_MODELS:
        raise HTTPException(status_code=400, detail="Invalid model ID. Check /models for available options.")

    selected_model_id = request.model_id
    model = init_chat_model(selected_model_id, model_provider="groq")

    return {"success": True, "message": f"Model changed to {selected_model_id}"}
