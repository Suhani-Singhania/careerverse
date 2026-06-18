# from sqlalchemy.orm import DeclarativeBase
# from sqlalchemy.orm import Mapped, mapped_column
# from sqlalchemy import String,JSON,DateTime
# from datetime import datetime

# class Base(DeclarativeBase):
#     pass


# class User(Base):
#     __tablename__ = "users"

#     id: Mapped[int] = mapped_column(primary_key=True)
#     email: Mapped[str] = mapped_column(String(255), unique=True)
#     hashed_password: Mapped[str] = mapped_column(String(255))
    
"""
MongoDB does not need SQLAlchemy table models.

Generated projects are stored directly in the
`generated_projects` MongoDB collection.
"""

# class GeneratedProject(Base):
#     __tablename__ = "generated_projects"

#     id: Mapped[int] = mapped_column(primary_key=True, index=True)
#     role: Mapped[str] = mapped_column(String(100), nullable=False)
#     experience: Mapped[str] = mapped_column(String(100), nullable=False)
#     project_name: Mapped[str] = mapped_column(String(255), nullable=False)
#     project_data: Mapped[dict] = mapped_column(JSON, nullable=False)
#     created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
