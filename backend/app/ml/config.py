import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
KNOWLEDGE_BASE_PATH = os.getenv("KNOWLEDGE_BASE_PATH", str(DATA_DIR / "plants.json"))

# Model Configuration
# 'mock' for testing UI/API without weights; 'real' to load TensorFlow/EfficientDet weights
MODEL_MODE = os.getenv("MODEL_MODE", "mock").lower()
MODEL_PATH = os.getenv("MODEL_PATH", str(MODELS_DIR / "efficientdet_best"))
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.50"))

# EfficientDet-D0/D1 Specs
IMAGE_SIZE = int(os.getenv("IMAGE_SIZE", "512"))  # 512 for D0, 640 for D1
NUM_CLASSES = 10

CLASSES = [
    "Neem",
    "Tulsi",
    "Aloe Vera",
    "Moringa",
    "Guava",
    "Curry Leaf",
    "Mint",
    "Hibiscus",
    "Eucalyptus",
    "Ashoka"
]

CLASS_TO_SCIENTIFIC = {
    "Neem": "Azadirachta indica",
    "Tulsi": "Ocimum tenuiflorum",
    "Aloe Vera": "Aloe vera",
    "Moringa": "Moringa oleifera",
    "Guava": "Psidium guajava",
    "Curry Leaf": "Murraya koenigii",
    "Mint": "Mentha",
    "Hibiscus": "Hibiscus rosa-sinensis",
    "Eucalyptus": "Eucalyptus",
    "Ashoka": "Saraca asoca"
}
