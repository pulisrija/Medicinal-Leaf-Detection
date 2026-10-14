import os

# Model & Training Hyperparameters for EfficientDet-D0
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

# Image Dimensions
# EfficientDet-D0: 512x512 | D1: 640x640
IMAGE_SIZE = 512
CHANNELS = 3

# Training Hyperparameters
BATCH_SIZE = 16
LEARNING_RATE = 1e-3
WARMUP_EPOCHS = 5
EPOCHS = 50
WEIGHT_DECAY = 1e-4
MOMENTUM = 0.9

# Detection Hyperparameters
CONFIDENCE_THRESHOLD = 0.50
IOU_THRESHOLD = 0.50
MAX_DETECTIONS = 10

# Paths
DATASET_PATH = os.getenv("DATASET_PATH", "./dataset")
CHECKPOINT_DIR = os.getenv("CHECKPOINT_DIR", "./checkpoints")
EXPORT_PATH = os.getenv("EXPORT_PATH", "../backend/models/efficientdet_best")

# Split Ratios (No data leakage)
TRAIN_SPLIT = 0.70
VAL_SPLIT = 0.20
TEST_SPLIT = 0.10
