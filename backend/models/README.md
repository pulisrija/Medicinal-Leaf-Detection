# Trained Models Directory

This directory stores the trained deep learning weights for the EfficientDet medicinal plant detector and classifier.

## Directory Structure Expected in Production

When training is completed using the pipeline in `/training`, export your model here:

```
backend/models/
└── efficientdet_best/
    ├── saved_model.pb
    ├── variables/
    │   ├── variables.data-00000-of-00001
    │   └── variables.index
    └── assets/
```

## How to Enable Real Model Inference

1. Train the model using Google Colab or your GPU machine (refer to `/training/README.md`).
2. Download the exported `efficientdet_best/` directory.
3. Place `efficientdet_best/` in `backend/models/`.
4. In your `.env` file or environment variables, configure:
   ```bash
   MODEL_MODE=real
   MODEL_PATH=./backend/models/efficientdet_best
   CONFIDENCE_THRESHOLD=0.50
   ```
5. Restart the FastAPI backend. The `/api/health` endpoint will confirm `model_mode: real`.
