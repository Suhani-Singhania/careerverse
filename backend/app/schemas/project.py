from pydantic import BaseModel
from typing import List


class ProjectRequest(BaseModel):
    role: str
    experience: str


class ProjectResponse(BaseModel):
    project_name: str
    description: str
    sprint_goal: str
    tasks: List[str]