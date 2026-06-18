# backend/app/database/database.py
import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient


load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "careerverse")

if not MONGODB_URL:
    raise RuntimeError("MONGODB_URL is missing in backend/.env")

client = AsyncIOMotorClient(MONGODB_URL)
database = client[MONGODB_DB_NAME]


async def get_db():
    yield database