"""Server startup script"""

import uvicorn
from app.config.settings import settings

import os

if __name__ == "__main__":
    # CRITICAL FIX FOR RENDER DEPLOYMENT
    # Render sets the PORT environment variable. We MUST listen on that port.
    # Locally, PORT is usually unset, so we default to settings.port (8000).
    port = int(os.environ.get("PORT", settings.port))
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0", # Always bind to 0.0.0.0 for deployment
        port=port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
