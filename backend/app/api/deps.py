# # backend/app/api/deps.py
# from fastapi import Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordBearer
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select
# from app.database.database import get_db
# from app.services.auth_service import AuthService
# from app.models.domain import User
# import uuid

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# async def get_current_user(
#     token: str = Depends(oauth2_scheme),
#     db: AsyncSession = Depends(get_db)
# ) -> User:
#     """Validates the JWT token payload and returns the database User entity."""
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
    
#     payload = AuthService.decode_access_token(token)
#     if payload is None:
#         raise credentials_exception
        
#     user_id_str: str = payload.get("sub")
#     if user_id_str is None:
#         raise credentials_exception
        
#     try:
#         user_uuid = uuid.UUID(user_id_str)
#     except ValueError:
#         raise credentials_exception

#     # Query user safely using modern SQLAlchemy 2.0 style
#     result = await db.execute(select(User).where(User.id == user_uuid))
#     user = result.scalar_one_or_none()
    
#     if user is None:
#         raise credentials_exception
        
#     if not user.is_active:
#         raise HTTPException(status_code=400, detail="Inactive user account")
        
#     return user
from bson import ObjectId
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.database import get_db
from app.services.auth_service import AuthService


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    token = credentials.credentials
    payload = AuthService.decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = await db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    user["id"] = str(user["_id"])
    return user