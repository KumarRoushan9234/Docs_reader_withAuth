from fastapi import APIRouter, HTTPException
from app.models import QuizRequest, QuizResponse
from app.dependencies import model
from backend_fast.app.schemas import load_documents

router = APIRouter(prefix="/quiz", tags=["Quiz"])

@router.post("/", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """Generates a multiple-choice quiz based on stored documents."""
    documents = load_documents("user")
    if not documents:
        raise HTTPException(status_code=400, detail="No documents available. Extract documents first.")

    extracted_text = "\n".join(documents.values())

    quiz_prompt = [
        ("system", f"You are Dwight Schrute. Generate {request.num_questions} MCQs based on the document."),
        ("human", f"Document: {extracted_text}")
    ]
    
    response = model.invoke(quiz_prompt)

    return QuizResponse(success=True, quiz=response.content)
