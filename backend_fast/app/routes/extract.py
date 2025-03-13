from fastapi import APIRouter
from app.models import DocumentRequest, SummaryResponse
from app.dependencies import model
from backend_fast.app.schemas import save_documents, load_documents

router = APIRouter(prefix="/extract", tags=["Extraction"])

@router.post("/", response_model=SummaryResponse)
async def extract_text(request: DocumentRequest):
    """Extracts text, summarizes it, and stores it for future use."""
    save_documents("user", request.documents)
    extracted_text = "\n".join(request.documents.values())

    messages = [
        ("system", "Summarize the following document text."),
        ("human", extracted_text)
    ]
    summary = model.invoke(messages).content

    return SummaryResponse(success=True, summary=summary, key_points=summary.split("\n"))
