# HerbVision AI — An Intelligent Deep Learning System for Medicinal Plant Classification and Herbal Remedy Recommendation

[![B.Tech Mini Project](https://img.shields.io/badge/B.Tech-Mini%20Project-emerald.svg)](#academic-information)
[![Department](https://img.shields.io/badge/Department-Information%20Technology-blue.svg)](#academic-information)
[![Institution](https://img.shields.io/badge/Institution-Anurag%20University-darkgreen.svg)](#academic-information)
[![Architecture](https://img.shields.io/badge/Architecture-EfficientDet--D0%20%7C%20BiFPN-purple.svg)](#model-architecture)

> **HerbVision AI** is an academic deep learning and full-stack web application designed to identify Indian medicinal plants from leaf photographs using an **EfficientDet** object detection model and retrieve traditional ethnobotanical and Ayurvedic remedies.

---

## Academic Information

- **Project Title:** An Intelligent Deep Learning System for Medicinal Plant Classification and Herbal Remedy Recommendation
- **Project Type:** B.Tech Mini Project
- **Department:** Department of Information Technology
- **Institution:** Anurag University, Hyderabad, Telangana
- **Student Authors:**
  1. **Sankeerthana G**
  2. **P. Srija**
  3. **V. Shirisha**
- **Project Guide:** **Mr. B. Ravi Raju**, Assistant Professor, Dept. of Information Technology

---

## 1. Problem Statement

India possesses a rich heritage of traditional medicine (Ayurveda, Siddha, Unani) encompassing thousands of therapeutic flora. However, accurate botanical identification in the field requires specialized taxonomic expertise. Misidentification of lookalike species poses health hazards due to varying toxicity levels. Conventional computer vision classifiers often treat entire images as uniform bags of pixels, failing to isolate the leaf blade from background soil, foliage, or human hands. HerbVision AI addresses this by coupling **EfficientDet** object detection (leaf localization via bounding boxes) with structured **ethnobotanical knowledge retrieval**.

---

## 2. Key Objectives

1. Develop a responsive, modern web interface for leaf image ingestion and real-time visualization.
2. Localize medicinal leaf boundaries using bounding box regression to exclude background noise.
3. Classify leaves into one of 10 therapeutic Indian species with a safety-gated confidence threshold ($0.50$).
4. Provide visual interpretability indicators (BiFPN multi-scale feature attention points highlighting serration, midrib, and apex).
5. Retrieve structured traditional remedies, preparation methods, active phytochemical markers, and safety contraindications.
6. Provide a complete Google Colab GPU training pipeline and a standalone FastAPI backend.

---

## 3. Supported Initial Plant Classes (10 Species)

| # | Common Name | Scientific Botanical Name | Family | Key Active Phytochemicals |
|---|---|---|---|---|
| 1 | **Neem** | *Azadirachta indica* | Meliaceae | Azadirachtin, Nimbin, Quercetin |
| 2 | **Tulsi** | *Ocimum tenuiflorum* | Lamiaceae | Eugenol, Rosmarinic Acid, Ursolic Acid |
| 3 | **Aloe Vera** | *Aloe vera* | Asphodelaceae | Acemannan, Aloin, Barbaloin |
| 4 | **Moringa** | *Moringa oleifera* | Moringaceae | Moringine, Quercetin, Chlorogenic Acid |
| 5 | **Guava** | *Psidium guajava* | Myrtaceae | Guajaverin, Ellagic Acid, Tannins |
| 6 | **Curry Leaf** | *Murraya koenigii* | Rutaceae | Mahanimbine, Koenimbine, Girimbine |
| 7 | **Mint** | *Mentha* | Lamiaceae | Menthol, Menthone, Rosmarinic Acid |
| 8 | **Hibiscus** | *Hibiscus rosa-sinensis* | Malvaceae | Cyanidin-3-glucoside, Mucilage |
| 9 | **Eucalyptus** | *Eucalyptus* | Myrtaceae | 1,8-Cineole (Eucalyptol), Terpineol |
| 10 | **Ashoka** | *Saraca asoca* | Fabaceae | Saracin, Epicatechin, Catechin |

---

## 4. System Architecture

```
User Leaf Photograph (JPG / PNG)
               │
               ▼
┌──────────────────────────────────────┐
│           React Frontend             │
│   · Drag & Drop / Specimen Selector  │
│   · Bounding Box Overlay Canvas      │
│   · Dual-Mode (FastAPI / Simulator)  │
└──────────────────┬───────────────────┘
                   │ HTTP POST (Multipart)
                   ▼
┌──────────────────────────────────────┐
│           FastAPI Backend            │
│   · Byte Validation & Error Handling │
│   · Letterbox Resizing to 512×512    │
│   · RGB Channel Normalization [0, 1] │
└──────────────────┬───────────────────┘
                   │ Preprocessed Tensor
                   ▼
┌──────────────────────────────────────┐
│       EfficientDet-D0 Model          │
│   ┌──────────────────────────────┐   │
│   │  EfficientNet-B0 Backbone    │   │
│   └──────────────┬───────────────┘   │
│                  ▼                   │
│   ┌──────────────────────────────┐   │
│   │   BiFPN Layers (P3 – P7)     │   │
│   │  (Bidirectional Fusion)      │   │
│   └──────────────┬───────────────┘   │
│                  ▼                   │
│   ┌──────────────┴───────────────┐   │
│   │ Box Head     │  Class Head   │   │
│   │ [x1,y1,x2,y2]│  (10 Species) │   │
│   └──────────────┬───────────────┘   │
└──────────────────┼───────────────────┘
                   │ Prediction & Confidence
                   ▼
┌──────────────────────────────────────┐
│     Confidence Filter (τ ≥ 0.50)     │
│  · If < 0.50 ➔ Low Confidence Alert  │
│  · If ≥ 0.50 ➔ Species Identified    │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│    Ethnobotanical Knowledge Base     │
│   (backend/data/plants.json)         │
│   · Traditional Ayurvedic Uses       │
│   · Preparation Instructions         │
│   · Precautions & Contraindications  │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│      Structured JSON Response        │
│   Rendered in Interactive UI Cards   │
└──────────────────────────────────────┘
```

---

## 5. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Python 3.10+, FastAPI, Uvicorn, Pydantic, Pillow, NumPy
- **Machine Learning & Deep Learning:** TensorFlow 2.x, Keras, EfficientNet, BiFPN, Google Colab GPU
- **Database / Knowledge Base:** Decoupled JSON (`backend/data/plants.json`), architected for easy future migration to PostgreSQL or MongoDB

---

## 6. Project Structure

```
herbvision-ai/
│
├── frontend/ (src/)
│   ├── assets/              # High-fidelity botanical photography assets
│   ├── components/          # Navbar, Footer, BoundingBoxOverlay
│   ├── data/                # Synchronized plants data & test specimen presets
│   ├── pages/               # Home, Identify, Plants, Detail, HowItWorks, About
│   ├── services/            # api.ts (FastAPI communication & engine fallback)
│   ├── types/               # TypeScript data definitions
│   ├── App.tsx              # Root app orchestrator
│   └── main.tsx             # Entry point
│
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application & REST endpoints
│   │   └── ml/
│   │       ├── config.py            # Centralized settings & classes
│   │       ├── preprocessing.py     # Image validation & letterboxing
│   │       ├── efficientdet_model.py# Real TensorFlow SavedModel loader
│   │       └── inference.py         # Mock vs Real inference orchestrator
│   ├── data/
│   │   └── plants.json      # Structured ethnobotanical knowledge base
│   ├── models/
│   │   └── README.md        # Instructions for placing trained weights
│   ├── requirements.txt     # Python backend dependencies
│   └── README.md
│
├── training/
│   ├── config.py                     # Training hyperparameters
│   ├── dataset/dataset_loader.py     # 70/20/10 split without data leakage
│   ├── preprocessing/augmentation.py # Synchronous augmentation & bbox shift
│   ├── models/efficientdet_architecture.py # EfficientNet + BiFPN construction
│   ├── training/train.py             # AdamW, Cosine Decay, ModelCheckpoint
│   ├── evaluation/evaluate.py         # Precision, Recall, F1, mAP@0.5 calculation
│   ├── notebooks/
│   │   └── HerbVision_EfficientDet_Colab.ipynb # Google Colab GPU notebook
│   └── README.md
│
├── .env.example
├── .gitignore
├── metadata.json
├── package.json
└── README.md
```

---

## 7. How to Run the Application

### Running the Frontend

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev
```

Open `http://localhost:3000` in your web browser.

### Running the FastAPI Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

The interactive API documentation is accessible at `http://localhost:8000/docs`.

### Switching Between Mock and Real Model Mode

In `backend/.env` (or environment variables):

```bash
# To run in Mock/Testing mode (no trained weights required):
MODEL_MODE=mock

# To run with Real Trained EfficientDet weights:
MODEL_MODE=real
MODEL_PATH=./backend/models/efficientdet_best
CONFIDENCE_THRESHOLD=0.50
```

---

## 8. Training Pipeline (Google Colab GPU)

1. Open `training/notebooks/HerbVision_EfficientDet_Colab.ipynb` in [Google Colab](https://colab.research.google.com).
2. Enable GPU: `Runtime > Change runtime type > T4 GPU`.
3. Check GPU status:
   ```python
   import tensorflow as tf
   print(tf.config.list_physical_devices('GPU'))
   ```
4. Mount your dataset structured by class folders:
   ```
   dataset/
     ├── Neem/
     ├── Tulsi/
     ├── Aloe Vera/
     └── ...
   ```
5. Run the cells to train using **AdamW** and **Cosine Decay**.
6. The model will be exported as a SavedModel directory (`efficientdet_best/`).
7. Download and place `efficientdet_best/` in `backend/models/`.

---

## 9. Evaluation Protocol & Anti-Fabrication Notice

In accordance with academic rigor, **this project never fabricates test accuracy or mAP figures**. Quantitative metrics must only be reported after training on verified botanical datasets:
- **Metrics Calculated:** Precision, Recall, F1-Score, and Mean Average Precision (mAP@0.50 and mAP@[0.50:0.95]).
- **Split:** 70% Train, 20% Validation, 10% Test with stratified class distribution.
- **Run Evaluation:**
  ```bash
  python -m training.evaluation.evaluate --model_path ../backend/models/efficientdet_best --test_dir ./dataset/test
  ```

---

## 10. Medical & Educational Disclaimer

> **Important Notice:** This application provides educational and ethnobotanical information about medicinal plants. The information is not medical advice and should not be used to diagnose, treat, cure, or prevent any disease. Consult a qualified healthcare professional before using medicinal plants.
