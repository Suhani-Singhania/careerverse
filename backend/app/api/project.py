from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.project import ProjectRequest, ProjectResponse
from app.services.project_service import generate_project
from app.database.database import get_db
from app.api.deps import get_current_user


router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"]
)


def serialize_project(project):
    return {
        "id": str(project["_id"]),
        "role": project["role"],
        "experience": project["experience"],
        "project_name": project["project_name"],
        "project_data": project["project_data"],
        "created_at": project["created_at"],
    }


@router.post(
    "/generate",
    response_model=ProjectResponse,
    summary="Generate a personalized AI project with Gemini"
)
async def generate_project_api(
    request: ProjectRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        project = generate_project(
            role=request.role,
            experience=request.experience
        )

        saved_project = {
            "user_id": current_user["id"],
            "role": request.role,
            "experience": request.experience,
            "project_name": project.project_name,
            "project_data": project.model_dump(),
            "created_at": datetime.utcnow(),
        }

        await db.generated_projects.insert_one(saved_project)

        return project

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Failed to generate project. Please try again."
        )
    except Exception as e:
        print("Project generation error:", e)
        raise HTTPException(
            status_code=500,
            detail="Failed to generate project. Please try again."
        )


@router.get("/history")
async def get_project_history(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    cursor = db.generated_projects.find(
        {"user_id": current_user["id"]}
    ).sort("created_at", -1)

    projects = await cursor.to_list(length=100)

    return [serialize_project(project) for project in projects]


@router.get("/history/{project_id}")
async def get_project_by_id(
    project_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = await db.generated_projects.find_one({
        "_id": ObjectId(project_id),
        "user_id": current_user["id"],
    })

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return serialize_project(project)