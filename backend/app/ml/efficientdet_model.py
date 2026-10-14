import os
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("herbvision.ml")

class EfficientDetModelService:
    """
    Dedicated model loader for EfficientDet (EfficientNet backbone + BiFPN + Detection Heads).
    Supports loading trained TensorFlow SavedModel or Keras weights.
    """
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.is_loaded = False
        self._load_model()

    def _load_model(self):
        if not os.path.exists(self.model_path):
            logger.warning(
                f"[REAL ML] Model checkpoint directory not found at: {self.model_path}. "
                "Ensure trained EfficientDet weights are placed in backend/models/ or switch MODEL_MODE=mock."
            )
            return

        try:
            import tensorflow as tf
            logger.info(f"Loading trained EfficientDet model from {self.model_path}...")
            self.model = tf.saved_model.load(self.model_path)
            self.is_loaded = True
            logger.info("Successfully loaded EfficientDet model into memory.")
        except ImportError:
            logger.error("TensorFlow is not installed in the current Python environment.")
        except Exception as e:
            logger.error(f"Failed to load EfficientDet model: {str(e)}")

    def predict(self, preprocessed_tensor) -> Optional[Dict[str, Any]]:
        """
        Executes real EfficientDet forward pass.
        Expected output signatures:
        - boxes: [batch, num_detections, 4] (ymin, xmin, ymax, xmax normalized)
        - scores: [batch, num_detections]
        - classes: [batch, num_detections]
        """
        if not self.is_loaded or self.model is None:
            raise RuntimeError(
                f"EfficientDet model is not loaded. Path checked: {self.model_path}. "
                "Train the model using the /training pipeline or set MODEL_MODE=mock in .env."
            )
        
        # Invoke TensorFlow signature
        infer = self.model.signatures.get("serving_default", self.model)
        outputs = infer(preprocessed_tensor)
        return outputs
