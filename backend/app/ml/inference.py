import json
import logging
import random
from typing import Dict, Any, List, Optional
from PIL import Image
import numpy as np

from .config import (
    MODEL_MODE,
    MODEL_PATH,
    CONFIDENCE_THRESHOLD,
    CLASSES,
    CLASS_TO_SCIENTIFIC,
    KNOWLEDGE_BASE_PATH
)
from .preprocessing import preprocess_for_efficientdet
from .efficientdet_model import EfficientDetModelService

logger = logging.getLogger("herbvision.ml")

# Global Real Model Instance (initialized if MODEL_MODE == "real")
real_model_service: Optional[EfficientDetModelService] = None

def get_real_model():
    global real_model_service
    if real_model_service is None and MODEL_MODE == "real":
        real_model_service = EfficientDetModelService(MODEL_PATH)
    return real_model_service

def load_knowledge_base() -> Dict[str, Any]:
    """Loads plant details from data/plants.json"""
    try:
        with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            # Create a lookup mapping by plant name
            lookup = {plant["name"].lower(): plant for plant in data.get("plants", [])}
            return lookup
    except Exception as e:
        logger.error(f"Error reading plant knowledge base at {KNOWLEDGE_BASE_PATH}: {e}")
        return {}

def mock_leaf_inference(image: Image.Image, filename: Optional[str] = None) -> Dict[str, Any]:
    """
    Intelligent simulation for UI development and academic demonstration.
    Labels results explicitly with is_mock=True.
    Analyzes filename keywords and visual features to pick the accurate plant candidate.
    """
    width, height = image.size
    
    # Analyze dominant color in center region to detect leaf presence
    center_box = (int(width * 0.25), int(height * 0.25), int(width * 0.75), int(height * 0.75))
    cropped = image.crop(center_box).resize((32, 32))
    rgb_arr = np.array(cropped, dtype=np.float32)
    avg_r = np.mean(rgb_arr[:, :, 0])
    avg_g = np.mean(rgb_arr[:, :, 1])
    avg_b = np.mean(rgb_arr[:, :, 2])

    # If image does not show a botanical specimen (e.g., completely dark, white, or red)
    if avg_g < 30 or (avg_g < avg_r * 0.75 and avg_g < avg_b * 0.75):
        # Trigger low confidence / unconfident detection
        return {
            "success": False,
            "is_mock": True,
            "detected": False,
            "confidence": round(random.uniform(0.18, 0.42), 3),
            "threshold": CONFIDENCE_THRESHOLD,
            "message": "Unable to confidently detect a medicinal plant leaf in this image. Please upload a clear leaf photograph with adequate illumination.",
            "bounding_box": None,
            "candidate_classes": []
        }

    # Match by filename keywords
    selected_name = None
    fn = (filename or "").lower()
    if any(k in fn for k in ["tulsi", "basil", "holy", "ocimum"]):
        selected_name = "Tulsi"
    elif any(k in fn for k in ["aloe", "ghrita", "vera"]):
        selected_name = "Aloe Vera"
    elif any(k in fn for k in ["neem", "azadirachta", "margosa", "nimba"]):
        selected_name = "Neem"
    elif any(k in fn for k in ["moringa", "drumstick", "sahjan", "shigru"]):
        selected_name = "Moringa"
    elif any(k in fn for k in ["guava", "amrood", "psidium"]):
        selected_name = "Guava"
    elif any(k in fn for k in ["curry", "karivepaku", "kadi", "murraya"]):
        selected_name = "Curry Leaf"
    elif any(k in fn for k in ["mint", "pudina", "mentha"]):
        selected_name = "Mint"
    elif any(k in fn for k in ["hibiscus", "gudhal", "japa"]):
        selected_name = "Hibiscus"
    elif any(k in fn for k in ["eucalyptus", "nilgiri"]):
        selected_name = "Eucalyptus"
    elif any(k in fn for k in ["ashoka", "asoca", "saraca"]):
        selected_name = "Ashoka"

    if not selected_name:
        # Default to Tulsi if unspecified botanical specimen
        selected_name = "Tulsi"

    scientific_name = CLASS_TO_SCIENTIFIC.get(selected_name, "Species undetermined")

    # Plausible high confidence
    confidence = round(random.uniform(0.86, 0.95), 3)

    # Realistic centered leaf bounding box with margin
    margin_x = int(width * random.uniform(0.12, 0.18))
    margin_y = int(height * random.uniform(0.10, 0.16))
    x1 = max(10, margin_x)
    y1 = max(10, margin_y)
    x2 = min(width - 10, width - margin_x)
    y2 = min(height - 10, height - margin_y)

    # Generate 5 saliency/feature attention points (interpretability simulation)
    center_x = (x1 + x2) // 2
    center_y = (y1 + y2) // 2
    interpretability = {
        "architecture": "EfficientDet-D0 (BiFPN Level P3-P7 Feature Fusion)",
        "backbone": "EfficientNet-B0 Compound Scaled",
        "salient_leaf_features": [
            {"name": "Marginal Serration / Edge Contour", "weight": 0.38, "point": [center_x, y1 + int((y2 - y1) * 0.2)]},
            {"name": "Primary Midrib & Secondary Venation", "weight": 0.32, "point": [center_x, center_y]},
            {"name": "Apex Curvature & Petiole Insertion", "weight": 0.19, "point": [center_x, y2 - int((y2 - y1) * 0.15)]},
            {"name": "Laminar Glandular Trichomes / Texture", "weight": 0.11, "point": [x1 + int((x2 - x1) * 0.3), center_y]}
        ]
    }

    # Top candidates for class probability distribution
    other_classes = [c for c in CLASSES if c != selected_name]
    random.shuffle(other_classes)
    remaining_prob = 1.0 - confidence
    p2 = round(remaining_prob * 0.65, 3)
    p3 = round(remaining_prob * 0.35, 3)

    candidates = [
        {"name": selected_name, "confidence": confidence},
        {"name": other_classes[0], "confidence": p2},
        {"name": other_classes[1], "confidence": p3}
    ]

    return {
        "success": True,
        "is_mock": True,
        "detected": True,
        "plant_name": selected_name,
        "scientific_name": scientific_name,
        "confidence": confidence,
        "threshold": CONFIDENCE_THRESHOLD,
        "bounding_box": {
            "x1": int(x1),
            "y1": int(y1),
            "x2": int(x2),
            "y2": int(y2),
            "width": int(x2 - x1),
            "height": int(y2 - y1)
        },
        "candidate_classes": candidates,
        "interpretability": interpretability
    }

def real_leaf_inference(image: Image.Image) -> Dict[str, Any]:
    """
    Executes actual EfficientDet forward pass using TensorFlow weights.
    """
    model_service = get_real_model()
    if model_service is None or not model_service.is_loaded:
        raise RuntimeError("Real EfficientDet weights not found. Verify MODEL_PATH or set MODEL_MODE=mock.")

    tensor, (orig_w, orig_h), scale = preprocess_for_efficientdet(image)
    raw_outputs = model_service.predict(tensor)

    # Parse TensorFlow detections
    # Typical signature keys: 'detection_boxes', 'detection_scores', 'detection_classes'
    boxes = raw_outputs.get("detection_boxes", raw_outputs.get("boxes", [[]]))[0]
    scores = raw_outputs.get("detection_scores", raw_outputs.get("scores", [[]]))[0]
    classes = raw_outputs.get("detection_classes", raw_outputs.get("classes", [[]]))[0]

    if len(scores) == 0 or float(scores[0]) < CONFIDENCE_THRESHOLD:
        return {
            "success": False,
            "is_mock": False,
            "detected": False,
            "confidence": float(scores[0]) if len(scores) > 0 else 0.0,
            "threshold": CONFIDENCE_THRESHOLD,
            "message": "Confidence score falls below threshold (0.50). Leaf identity cannot be established reliably.",
            "bounding_box": None,
            "candidate_classes": []
        }

    top_class_id = int(classes[0])
    top_score = round(float(scores[0]), 3)

    if 0 <= top_class_id < len(CLASSES):
        plant_name = CLASSES[top_class_id]
    else:
        plant_name = "Unknown Plant"

    scientific_name = CLASS_TO_SCIENTIFIC.get(plant_name, "Species undetermined")

    # Convert normalized box [ymin, xmin, ymax, xmax] to pixel coordinates [x1, y1, x2, y2]
    ymin, xmin, ymax, xmax = [float(v) for v in boxes[0]]
    x1 = int(xmin * orig_w)
    y1 = int(ymin * orig_h)
    x2 = int(xmax * orig_w)
    y2 = int(ymax * orig_h)

    return {
        "success": True,
        "is_mock": False,
        "detected": True,
        "plant_name": plant_name,
        "scientific_name": scientific_name,
        "confidence": top_score,
        "threshold": CONFIDENCE_THRESHOLD,
        "bounding_box": {
            "x1": x1,
            "y1": y1,
            "x2": x2,
            "y2": y2,
            "width": x2 - x1,
            "height": y2 - y1
        },
        "candidate_classes": [
            {"name": plant_name, "confidence": top_score}
        ],
        "interpretability": {
            "architecture": "EfficientDet-D0",
            "backbone": "EfficientNet-B0",
            "feature_levels": ["P3", "P4", "P5", "P6", "P7"]
        }
    }

def run_prediction_pipeline(image: Image.Image, filename: Optional[str] = None) -> Dict[str, Any]:
    """
    Main entry point: selects Real or Mock prediction, applies confidence filtering,
    and merges ethnobotanical information from the knowledge base.
    """
    if MODEL_MODE == "real":
        try:
            pred_res = real_leaf_inference(image)
        except Exception as e:
            logger.warning(f"Real model inference failed ({e}), falling back gracefully to mock prediction.")
            pred_res = mock_leaf_inference(image, filename=filename)
    else:
        pred_res = mock_leaf_inference(image, filename=filename)

    # Attach knowledge base details if plant was successfully identified
    if pred_res.get("success") and pred_res.get("plant_name"):
        kb = load_knowledge_base()
        plant_info = kb.get(pred_res["plant_name"].lower(), {})
        
        pred_res["traditional_uses"] = plant_info.get("traditional_uses", [])
        pred_res["parts_used"] = plant_info.get("parts_traditionally_used", [])
        pred_res["precautions"] = plant_info.get("precautions", [])
        pred_res["traditional_preparations"] = plant_info.get("traditional_preparations", [])
        pred_res["botanical_characteristics"] = plant_info.get("botanical_characteristics", "")
        pred_res["key_phytochemicals"] = plant_info.get("key_phytochemicals", [])
        pred_res["short_description"] = plant_info.get("short_description", "")
        pred_res["family"] = plant_info.get("family", "")

    return pred_res
