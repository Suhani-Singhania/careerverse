from fastapi import FastAPI

from app.api.project import router as project_router

app = FastAPI(
    title="CareerVerse API",
    version="1.0.0"
)

app.include_router(project_router)


@app.get("/")
def root():
    return {
        "message": "CareerVerse Backend Running 🚀"
    }