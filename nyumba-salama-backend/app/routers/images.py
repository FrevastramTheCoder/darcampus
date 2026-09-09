
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Header
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import os
import shutil
import re
import uuid

from app.database import get_db
from app.models import Image, User, Property
from app.dependencies import verify_token

router = APIRouter(prefix="/images", tags=["images"])

MAX_IMAGE_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'}

os.makedirs("uploads/images", exist_ok=True)


def is_admin(db: Session, authorization: Optional[str]) -> bool:
    """Validate the bearer token and require an admin database account."""
    if not authorization or not authorization.lower().startswith("bearer "):
        return False
    try:
        payload = verify_token(authorization.split(" ", 1)[1].strip())
    except Exception:
        return False
    user_id = payload.get("sub")
    if not user_id:
        return False
    return db.query(User).filter(
        User.id == user_id,
        User.role.in_(["admin", "ADMIN"]),
    ).first() is not None


@router.post("/upload")
async def upload_image(
    title: str = Form(...),
    price: float = Form(0),
    location: str = Form(""),
    university: str = Form(""),
    phone: str = Form(""),
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    try:
        admin = is_admin(db, authorization)
        if not admin:
            raise HTTPException(status_code=403, detail="Only admin can upload")
        
        # Validate file
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        if file_size > MAX_IMAGE_SIZE:
            raise HTTPException(status_code=400, detail=f"Max {MAX_IMAGE_SIZE // (1024*1024)}MB")
        
        safe_original_name = os.path.basename(file.filename or "")
        file_ext = os.path.splitext(safe_original_name)[1].lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail=f"Invalid: {file_ext}")
        
        # Save file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = re.sub(r'[^a-zA-Z0-9_.-]', '_', safe_original_name)
        filename = f"{timestamp}_{uuid.uuid4().hex}_{safe_filename}"
        filepath = f"uploads/images/{filename}"
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create record
        property_exists = db.query(Property).filter(Property.id == 1).first()
        if not property_exists:
            property_exists = Property(
                title="Default",
                description="Default",
                price=0,
                location="Default",
                university="Default",
                created_at=datetime.now()
            )
            db.add(property_exists)
            db.commit()
            db.refresh(property_exists)
        
        new_image = Image(
            title=title,
            description="Image uploaded by admin",
            url=f"/uploads/images/{filename}",
            property_id=property_exists.id,
            price=price,
            location=location,
            university=university,
            phone=phone,
            image_url=f"/uploads/images/{filename}",
            created_at=datetime.now()
        )
        
        db.add(new_image)
        db.commit()
        db.refresh(new_image)
        
        return {
            "success": True,
            "message": "Image uploaded!",
            "image": {
                "id": new_image.id,
                "title": new_image.title,
                "image_url": new_image.image_url,
                "price": new_image.price,
                "location": new_image.location,
                "university": new_image.university,
                "phone": new_image.phone
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def get_images(limit: int = 20, db: Session = Depends(get_db)):
    try:
        images = db.query(Image).order_by(Image.created_at.desc()).limit(limit).all()
        return {
            "images": [
                {
                    "id": img.id,
                    "title": img.title,
                    "price": img.price or 0,
                    "location": img.location or "",
                    "university": img.university or "",
                    "phone": img.phone or "",
                    "image_url": img.image_url,
                    "created_at": img.created_at.isoformat() if img.created_at else None
                }
                for img in images
            ],
            "total": len(images)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{image_id}")
async def delete_image(
    image_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    try:
        admin = is_admin(db, authorization)
        if not admin:
            raise HTTPException(status_code=403, detail="Only admin can delete")
        
        image = db.query(Image).filter(Image.id == image_id).first()
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Delete file
        if image.image_url:
            filename = image.image_url.split("/")[-1]
            file_path = f"uploads/images/{filename}"
            if os.path.exists(file_path):
                os.remove(file_path)
        
        db.delete(image)
        db.commit()
        return {"success": True, "message": "Deleted"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
