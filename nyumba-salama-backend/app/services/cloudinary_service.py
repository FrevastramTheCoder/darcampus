import os
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
import logging

logger = logging.getLogger("sankha-realestate")

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


async def upload_image_to_cloudinary(file: UploadFile, folder: str = "nyumbasalama") -> dict:
    """
    Upload image to Cloudinary.
    Returns dict with: url, public_id, format, width, height
    """
    try:
        contents = await file.read()
        
        result = cloudinary.uploader.upload(
            contents,
            folder=folder,
            resource_type="image",
            transformation=[
                {"width": 1200, "height": 1200, "crop": "limit"},
                {"quality": "auto:good"},
                {"fetch_format": "auto"},
            ],
        )
        
        logger.info(f"✅ Uploaded to Cloudinary: {result.get('public_id')}")
        
        return {
            "url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "width": result.get("width"),
            "height": result.get("height"),
        }
    except Exception as e:
        logger.error(f"❌ Cloudinary upload failed: {e}")
        raise


def delete_image_from_cloudinary(public_id: str) -> bool:
    """Delete image from Cloudinary"""
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception as e:
        logger.error(f"❌ Cloudinary delete failed: {e}")
        return False