from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.database.database import get_db
from app.schemas.resume import ResumeAnalysisResponse
from app.services.resume_service import analyze_resume_text


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"],
)


@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    allowed_extensions = (".pdf", ".doc", ".docx", ".txt")
    filename = file.filename or "uploaded_resume"

    if not filename.lower().endswith(allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOC, DOCX, or TXT files are supported.",
        )

    content = await file.read()

    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Resume file must be smaller than 5MB.",
        )

    # text = content.decode("utf-8", errors="ignore")
    text = content.decode("utf-8", errors="ignore")

    if not text.strip():
        text = (
            f"Uploaded file name: {filename}. "
            "The resume content could not be fully extracted yet. "
            "Analyze based on filename and provide general resume improvement guidance."
        )

    result = analyze_resume_text(text=text, filename=filename)

    await db.resume_analyses.insert_one(
        {
            "user_id": current_user["id"],
            "filename": filename,
            "result": result.model_dump(),
            "created_at": datetime.utcnow(),
        }
    )

    return result
