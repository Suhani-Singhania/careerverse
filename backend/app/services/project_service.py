def generate_project(role: str, experience: str) -> ProjectResponse:

    if role == "Backend Developer":
        project_name = "Distributed API Gateway"

    elif role == "Frontend Developer":
        project_name = "AI Portfolio Builder"

    else:
        project_name = "Full Stack Project"

    return ProjectResponse(
        project_name=project_name,
        description="Sample Description",
        sprint_goal="Sample Sprint Goal",
        tasks=[
            "Task 1",
            "Task 2",
            "Task 3"
        ]
    )