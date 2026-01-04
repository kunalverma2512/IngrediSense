"""File handling utilities"""

import os
import uuid
import shutil
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException, status
import requests
from app.config.settings import settings
from app.utils.logger import logger


class FileHandler:
    """Handle file uploads and downloads"""
    
    def __init__(self):
        """Initialize file handler and create upload directory"""
        self.upload_dir = Path(settings.upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
    
    def validate_file(self, file: UploadFile) -> bool:
        """Validate uploaded file type and size"""
        
        # Check file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in settings.allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed types: {', '.join(settings.allowed_extensions)}"
            )
        
        return True
    
    def save_upload_file(self, file: UploadFile) -> str:
        """Save uploaded file to disk and return the path"""
        
        try:
            # Validate file
            self.validate_file(file)
            
            # Generate unique filename
            file_ext = Path(file.filename).suffix.lower()
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            file_path = self.upload_dir / unique_filename
            
            # Save file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            logger.info(f"Saved uploaded file: {file_path}")
            return str(file_path)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error saving file: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )
    
    def download_from_url(self, url: str) -> str:
        """Download image from URL and save to disk"""
        
        try:
            # Download file
            response = requests.get(url, timeout=10, stream=True)
            response.raise_for_status()
            
            # Determine file extension from content type
            content_type = response.headers.get('content-type', '')
            if 'image/jpeg' in content_type or 'image/jpg' in content_type:
                file_ext = '.jpg'
            elif 'image/png' in content_type:
                file_ext = '.png'
            elif 'image/webp' in content_type:
                file_ext = '.webp'
            else:
                # Try to get from URL
                file_ext = Path(url).suffix.lower()
                if file_ext not in settings.allowed_extensions:
                    file_ext = '.jpg'  # Default
            
            # Generate unique filename
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            file_path = self.upload_dir / unique_filename
            
            # Save file
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            logger.info(f"Downloaded file from URL: {file_path}")
            return str(file_path)
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error downloading file from URL: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to download image from URL: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Error saving downloaded file: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save downloaded file: {str(e)}"
            )
    
    def cleanup_file(self, file_path: str):
        """Delete a file from disk"""
        
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Cleaned up file: {file_path}")
        except Exception as e:
            logger.warning(f"Failed to cleanup file {file_path}: {e}")


# Global file handler instance
file_handler = FileHandler()
