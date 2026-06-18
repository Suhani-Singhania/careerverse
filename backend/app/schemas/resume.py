from pydantic import BaseModel


class ResumeAnalysisResponse(BaseModel):
    score: int
    level: str
    skills: list[str]
    suggestions: list[str]
    summary: str