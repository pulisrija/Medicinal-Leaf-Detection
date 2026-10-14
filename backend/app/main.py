from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from typing import Dict, Any

from .ml.config import (
    MODEL_MODE,
    MODEL_PATH,
    CONFIDENCE_THRESHOLD,
    CLASSES,
    IMAGE_SIZE
)
from .ml.preprocessing import validate_and_load_image
from .ml.inference import run_prediction_pipeline, load_knowledge_base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("herbvision.api")

app = FastAPI(
    title="HerbVision AI API",
    description="Intelligent Deep Learning System for Medicinal Plant Classification & Herbal Remedy Recommendation using EfficientDet",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "project": "HerbVision AI",
        "description": "Intelligent Deep Learning System for Medicinal Plant Classification and Herbal Remedy Recommendation",
        "architecture": "EfficientDet-D0/D1 (EfficientNet Backbone + BiFPN)",
        "model_mode": MODEL_MODE,
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
def check_health():
    return {
        "status": "healthy",
        "model_mode": MODEL_MODE,
        "model_path": MODEL_PATH,
        "confidence_threshold": CONFIDENCE_THRESHOLD,
        "input_image_size": f"{IMAGE_SIZE}x{IMAGE_SIZE}",
        "supported_classes_count": len(CLASSES),
        "supported_classes": CLASSES
    }

@app.get("/api/plants")
def get_all_plants():
    kb = load_knowledge_base()
    plant_list = list(kb.values())
    return {
        "total": len(plant_list),
        "plants": plant_list
    }

@app.get("/api/plants/{plant_name}")
def get_plant_by_name(plant_name: str):
    kb = load_knowledge_base()
    key = plant_name.strip().lower()
    if key in kb:
        return {"success": True, "plant": kb[key]}
    
    # Try fuzzy match
    for k, data in kb.items():
        if key in k or k in key:
            return {"success": True, "plant": data}
            
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Plant '{plant_name}' not found in knowledge base."
    )

@app.post("/api/predict")
async def predict_plant(file: UploadFile = File(...)):
    # Validate content type
    allowed_content_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    if file.content_type and file.content_type.lower() not in allowed_content_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{file.content_type}'. Please upload a JPG or PNG image."
        )

    try:
        file_bytes = await file.read()
        image = validate_and_load_image(file_bytes)
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as e:
        logger.error(f"Image load failure: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to process uploaded image. Please provide a clear, uncorrupted leaf photograph."
        )

    # Run EfficientDet inference pipeline
    try:
        result = run_prediction_pipeline(image, filename=file.filename)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Prediction pipeline error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )
