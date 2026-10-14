# HerbVision AI — FastAPI Backend Service

FastAPI-powered REST API for Indian medicinal plant detection and ethnobotanical information retrieval.

## Features

- **FastAPI Framework**: High performance async ASGI server with interactive Swagger (`/docs`) and ReDoc (`/redoc`) documentation.
- **EfficientDet Integration**: Modular architecture supporting EfficientDet-D0/D1 inference with BiFPN feature fusion.
- **Dual Prediction Engine**:
  - `MODEL_MODE=mock`: Clean simulation mode for UI testing and academic demonstration without requiring heavy GPU weights.
  - `MODEL_MODE=real`: Loads TensorFlow SavedModel weights from `MODEL_PATH` for authentic deep learning inference.
- **Knowledge Base**: Independent JSON data repository (`backend/data/plants.json`) containing rich ethnobotanical, phytochemical, and precaution data for 10 initial plant classes.
- **Robust Preprocessing**: Safe byte validation, aspect ratio preservation with letterboxing, normalization, and corrupt image rejection.

## Setup Instructions

### 1. Create and Activate Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate on Linux / macOS:
source venv/bin/activate

# Activate on Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables (Optional)

Create a `.env` file in `backend/` or set variables directly:

```bash
MODEL_MODE=mock              # Set to 'real' when trained weights are loaded
MODEL_PATH=./models/efficientdet_best
CONFIDENCE_THRESHOLD=0.50
IMAGE_SIZE=512
```

### 4. Start the Server

```bash
uvicorn app.main:app --reload --port 8000
```

The server will start at `http://localhost:8000`.

### 5. API Endpoints

- `GET /` — API root information.
- `GET /api/health` — Service health and model status.
- `GET /api/plants` — List all 10 supported medicinal plants.
- `GET /api/plants/{plant_name}` — Get details for a specific medicinal plant.
- `POST /api/predict` — Upload image file (`multipart/form-data`) to obtain leaf detection, bounding box, classification, and herbal remedy knowledge.
- `GET /docs` — Interactive OpenAPI Swagger UI documentation.
