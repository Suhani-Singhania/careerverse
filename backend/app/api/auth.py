from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.database import get_db
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    LoginOTPResponse,
    OTPVerifyRequest,
    OTPResendRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    Token,
)
from app.services.auth_service import AuthService
from app.services.email_service import EmailService


router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)

OTP_EXPIRE_MINUTES = 5
MAX_OTP_VERIFY_ATTEMPTS = 5
MAX_OTP_RESEND_ATTEMPTS = 3


@router.post("/register", response_model=UserResponse)
async def register_user(
    user: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    existing_user = await db.users.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = AuthService.hash_password(user.password)

    new_user = {
        "email": user.email,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
    }

    result = await db.users.insert_one(new_user)

    return {
        "id": str(result.inserted_id),
        "email": user.email,
    }


@router.post("/login", response_model=LoginOTPResponse)
async def login_user(
    user: UserLogin,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    existing_user = await db.users.find_one({"email": user.email})

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_is_valid = AuthService.verify_password(
        user.password,
        existing_user["hashed_password"]
    )

    if not password_is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    otp = AuthService.generate_otp()
    otp_hash = AuthService.hash_otp(otp)
    otp_expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRE_MINUTES)

    await db.users.update_one(
        {"_id": existing_user["_id"]},
        {
            "$set": {
                "otp_hash": otp_hash,
                "otp_expires_at": otp_expires_at,
                "otp_attempts": 0,
                "otp_resend_count": 0,
                "otp_last_sent_at": datetime.utcnow(),
            }
        }
    )

    EmailService.send_otp_email(user.email, otp)

    return {
        "message": "OTP sent to your email",
        "requires_otp": True,
    }


@router.post("/verify-otp", response_model=Token)
async def verify_otp(
    data: OTPVerifyRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    existing_user = await db.users.find_one({"email": data.email})

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid OTP request"
        )

    otp_hash = existing_user.get("otp_hash")
    otp_expires_at = existing_user.get("otp_expires_at")
    otp_attempts = existing_user.get("otp_attempts", 0)

    if not otp_hash or not otp_expires_at:
        raise HTTPException(
            status_code=400,
            detail="No OTP found. Please login again."
        )

    if datetime.utcnow() > otp_expires_at:
        raise HTTPException(
            status_code=400,
            detail="OTP expired. Please request a new OTP."
        )

    if otp_attempts >= MAX_OTP_VERIFY_ATTEMPTS:
        raise HTTPException(
            status_code=429,
            detail="Too many OTP attempts. Please login again."
        )

    otp_is_valid = AuthService.verify_otp(data.otp, otp_hash)

    if not otp_is_valid:
        await db.users.update_one(
            {"_id": existing_user["_id"]},
            {"$inc": {"otp_attempts": 1}}
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid OTP"
        )

    token = AuthService.create_access_token({
        "sub": str(existing_user["_id"]),
        "email": existing_user["email"],
    })

    await db.users.update_one(
        {"_id": existing_user["_id"]},
        {
            "$unset": {
                "otp_hash": "",
                "otp_expires_at": "",
                "otp_attempts": "",
                "otp_resend_count": "",
                "otp_last_sent_at": "",
            }
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }


@router.post("/resend-otp", response_model=LoginOTPResponse)
async def resend_otp(
    data: OTPResendRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    existing_user = await db.users.find_one({"email": data.email})

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid OTP request"
        )

    resend_count = existing_user.get("otp_resend_count", 0)

    if resend_count >= MAX_OTP_RESEND_ATTEMPTS:
        raise HTTPException(
            status_code=429,
            detail="Too many resend attempts. Please login again."
        )

    otp = AuthService.generate_otp()
    otp_hash = AuthService.hash_otp(otp)
    otp_expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRE_MINUTES)

    await db.users.update_one(
        {"_id": existing_user["_id"]},
        {
            "$set": {
                "otp_hash": otp_hash,
                "otp_expires_at": otp_expires_at,
                "otp_last_sent_at": datetime.utcnow(),
            },
            "$inc": {
                "otp_resend_count": 1
            }
        }
    )

    EmailService.send_otp_email(data.email, otp)

    return {
        "message": "OTP resent to your email",
        "requires_otp": True,
    }
    
    
@router.post("/forgot-password")
async def forgot_password(
    data: ForgotPasswordRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    existing_user = await db.users.find_one({"email": data.email})

    # Do not reveal whether email exists
    if not existing_user:
        return {
            "message": "If this email exists, a reset code has been sent."
        }

    otp = AuthService.generate_otp()
    otp_hash = AuthService.hash_otp(otp)
    otp_expires_at = datetime.utcnow() + timedelta(minutes=5)

    await db.users.update_one(
        {"_id": existing_user["_id"]},
        {
            "$set": {
                "password_reset_otp_hash": otp_hash,
                "password_reset_otp_expires_at": otp_expires_at,
                "password_reset_attempts": 0,
            }
        }
    )

    EmailService.send_otp_email(data.email, otp)

    return {
        "message": "If this email exists, a reset code has been sent."
    }


@router.post("/reset-password")
async def reset_password(
    data: ResetPasswordRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    existing_user = await db.users.find_one({"email": data.email})

    if not existing_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid reset request"
        )

    otp_hash = existing_user.get("password_reset_otp_hash")
    otp_expires_at = existing_user.get("password_reset_otp_expires_at")
    reset_attempts = existing_user.get("password_reset_attempts", 0)

    if not otp_hash or not otp_expires_at:
        raise HTTPException(
            status_code=400,
            detail="No reset code found. Please request a new one."
        )

    if datetime.utcnow() > otp_expires_at:
        raise HTTPException(
            status_code=400,
            detail="Reset code expired. Please request a new one."
        )

    if reset_attempts >= 5:
        raise HTTPException(
            status_code=429,
            detail="Too many reset attempts. Please request a new code."
        )

    otp_is_valid = AuthService.verify_otp(data.otp, otp_hash)

    if not otp_is_valid:
        await db.users.update_one(
            {"_id": existing_user["_id"]},
            {"$inc": {"password_reset_attempts": 1}}
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid reset code"
        )

    new_hashed_password = AuthService.hash_password(data.new_password)

    await db.users.update_one(
        {"_id": existing_user["_id"]},
        {
            "$set": {
                "hashed_password": new_hashed_password,
            },
            "$unset": {
                "password_reset_otp_hash": "",
                "password_reset_otp_expires_at": "",
                "password_reset_attempts": "",
            }
        }
    )

    return {
        "message": "Password reset successful. You can now login."
    }