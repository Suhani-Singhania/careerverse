
from pydantic import BaseModel
from typing import List


class ProjectRequest(BaseModel):
    role: str  # e.g., "Backend Developer", "Frontend Developer", "Full Stack"
    experience: str  # e.g., "Beginner", "Intermediate", "Advanced"


class ProjectResponse(BaseModel):
    """Complete project specification for learning and building"""
    project_name: str
    description: str
    difficulty: str  # "Beginner", "Intermediate", "Advanced"
    
    # Tech Stack
    tech_stack: List[str]  # e.g., ["FastAPI", "PostgreSQL", "Redis"]
    
    # Features to build
    features: List[str]  # e.g., ["User Authentication", "Real-time Notifications"]
    
    # Database design
    database_schema: List[dict]  # Tables with fields
    
    # API endpoints to create
    api_endpoints: List[dict]  # Method, path, description, request/response
    
    # Implementation tasks
    tasks: List[str]  # Step-by-step tasks
    
    # For resume/portfolio
    resume_bullets: List[str]  # 3-5 achievements to highlight