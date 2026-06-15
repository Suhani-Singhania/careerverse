# backend/app/database/database.py
import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from dotenv import load_load

# Load environment variables
load_load()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/careerverse")

# Create High-Performance Async Engine
engine = create_async_engine(
    DATABASE_URL,
    echo=False, # Set to True if you need to debug raw SQL queries in development
    future=True,
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True
)

# Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Dependency Provider for Database Sessions
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI Dependency that yields an async database session and ensures cleanup."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()