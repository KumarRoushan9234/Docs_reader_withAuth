from fastapi import APIRouter, HTTPException
from app.models import ChatRequest, ChatResponse
from app.dependencies import model
from app.file_storage import load_documents

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat_with_documents(request: ChatRequest):
    """Chat with previously stored documents."""
    documents = load_documents("user")
    if not documents:
        raise HTTPException(status_code=400, detail="No documents available. Extract documents first.")

    extracted_text = "\n".join(documents.values())

    messages = [
        ("system", "You are Dwight Schrute. Only answer using the provided document."),
        ("human", f"Document: {extracted_text}\n\nUser Query: {request.query}")
    ]
    
    response = model.invoke(messages)

    return ChatResponse(success=True, response=response.content)
