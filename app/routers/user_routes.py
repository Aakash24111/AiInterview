from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import Response
from typing import Optional

from database import get_db
from models import User
from schemas import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

# ✅ Create User (with optional resume upload)
@router.post("/user_data", response_model=UserResponse)
async def create_user(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    file: Optional[UploadFile] = File(None),  # Optional Resume Upload
    db: AsyncSession = Depends(get_db)
):
    try:
        resume_filename = file.filename if file else None
        resume_data = await file.read() if file else None

        new_user = User(
            name=name,
            email=email,
            phone=phone,
            resume_filename=resume_filename,
            resume_data=resume_data
        )
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

