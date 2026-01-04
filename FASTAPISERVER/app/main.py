"""FastAPI main application"""

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.config.settings import settings
from app.middleware.cors import add_cors_middleware
from app.middleware.error_handler import add_exception_handlers
from app.api.routes.health_analysis import router as health_router
from app.utils.logger import logger

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered food label analysis and health risk assessment API",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add middleware
add_cors_middleware(app)

# Add exception handlers
add_exception_handlers(app)

# Include routers
app.include_router(health_router)


@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Debug mode: {settings.debug}")
    logger.info(f"CORS origins: {settings.cors_origins}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info(f"Shutting down {settings.app_name}")


@app.get("/", tags=["root"])
async def root():
    """Root endpoint"""
    return JSONResponse({
        "message": f"Welcome to {settings.app_name}",
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/v1/health"
    })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
