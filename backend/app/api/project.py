from fastapi import APIRouter

from app.schemas.project import (
    ProjectRequest,
    ProjectResponse
)

from app.services.project_service import generate_project

router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"]
)


@router.post(
    "/generate",
    response_model=ProjectResponse
)
def generate_project_api(
    request: ProjectRequest
):

    return generate_project(
        role=request.role,
        experience=request.experience
    )