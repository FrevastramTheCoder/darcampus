from fastapi import APIRouter, HTTPException, Header, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import bcrypt
import uuid
from datetime import datetime
from typing import Optional
import os

from app.database import get_db
from app.models import User

router = APIRouter(prefix="/bootstrap", tags=["bootstrap"])

BOOTSTRAP_SECRET = os.getenv("BOOTSTRAP_SECRET", "sankha-secret-2026")


class BootstrapRequest(BaseModel):
    email: str
    password: str
    phone: Optional[str] = None
    name: Optional[str] = "Admin"


@router.post("/make-admin")
async def make_admin(
    req: BootstrapRequest,
    x_bootstrap_secret: str = Header(...),
    db: Session = Depends(get_db),
):
    if x_bootstrap_secret != BOOTSTRAP_SECRET:
        raise HTTPException(status_code=403, detail="Invalid secret")

    hashed = bcrypt.hashpw(req.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = db.query(User).filter(User.email == req.email).first()

    if user:
        user.password = hashed
        user.role = "admin"
        user.is_approved = True
        user.can_upload = True
        user.is_banned = False
        if req.phone:
            user.phone = req.phone
        if req.name:
            user.name = req.name
        action = "updated"
    else:
        user = User(
            id=str(uuid.uuid4()),
            name=req.name or "Admin",
            email=req.email,
            phone=req.phone,
            password=hashed,
            role="admin",
            is_approved=True,
            can_upload=True,
            is_banned=False,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        db.add(user)
        action = "created"

    demoted = []
    others = db.query(User).filter(
        User.email != req.email, User.role == "admin"
    ).all()
    for u in others:
        u.role = "student"
        u.can_upload = False
        demoted.append(u.email)

    db.commit()

    return {
        "success": True,
        "action": action,
        "user": {
            "email": user.email,
            "role": user.role,
            "can_upload": user.can_upload,
            "is_approved": user.is_approved,
            "phone": user.phone,
        },
        "demoted": demoted,
    }