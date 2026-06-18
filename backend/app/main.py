from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.project import router as project_router
from app.api.auth import router as auth_router
from app.api.resume import router as resume_router
# from app.database.database import engine
# from app.models.domain import Base
import app.models.domain
app = FastAPI(
    title="CareerVerse API",
    version="1.0.0"
)

# @app.on_event("startup")
# async def create_tables():
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)
        
# Enable CORS to allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(project_router)
app.include_router(resume_router)

@app.get("/")
def root():
    return {
        "message": "CareerVerse Backend Running"
    }