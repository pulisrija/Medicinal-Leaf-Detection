# HerbVision AI — Machine Learning Pipeline & Training Guide

This directory contains the complete deep learning training and evaluation pipeline for **EfficientDet-D0/D1** applied to Indian medicinal plant leaf detection and classification.

## Directory Structure

```
training/
├── config.py                     # Centralized hyperparameters & paths
├── dataset/
│   └── dataset_loader.py         # 70/20/10 stratified split, tf.data pipeline
├── preprocessing/
│   └── augmentation.py           # Synchronous rotation, flip, zoom & bbox shifts
├── models/
│   └── efficientdet_architecture.py # EfficientNetB0 + BiFPN (P3-P7) + Heads
├── training/
│   └── train.py                  # Training loop with AdamW, Cosine Decay, Checkpointing
├── evaluation/
│   └── evaluate.py               # Precision, Recall, F1, mAP@0.5 calculation
├── notebooks/
│   └── HerbVision_EfficientDet_Colab.ipynb # Ready-to-run Google Colab GPU notebook
└── README.md
```

## Why EfficientDet (Instead of Standard CNNs or YOLO)?

1. **Compound Scaling**: EfficientDet scales resolution, backbone depth, and BiFPN width uniformly using a single compound scaling coefficient $\phi$.
2. **BiFPN Feature Fusion**: Unlike standard top-down FPN, BiFPN introduces bidirectional connections and weighted feature fusion, crucial for distinguishing subtle botanical venation patterns across varying leaf scales.
3. **Efficiency vs. Accuracy**: EfficientDet-D0 achieves competitive mAP with significantly fewer parameters and FLOPs than comparable detectors, making it feasible for low-latency inference on standard servers.

## Supported Classes (10 Species)

1. Neem (*Azadirachta indica*)
2. Tulsi (*Ocimum tenuiflorum*)
3. Aloe Vera (*Aloe vera*)
4. Moringa (*Moringa oleifera*)
5. Guava (*Psidium guajava*)
6. Curry Leaf (*Murraya koenigii*)
7. Mint (*Mentha*)
8. Hibiscus (*Hibiscus rosa-sinensis*)
9. Eucalyptus (*Eucalyptus*)
10. Ashoka (*Saraca asoca*)

## Dataset Target & Organization

- Recommended dataset size: 100–300 images per class.
- Structure:
  ```
  dataset/
  ├── Neem/
  ├── Tulsi/
  ├── Aloe Vera/
  └── ...
  ```
- Split protocol: **70% Train, 20% Validation, 10% Test** (stratified by class to avoid data leakage).

## Running in Google Colab (Recommended for Free GPU)

1. Open Google Colab (`https://colab.research.google.com`).
2. Upload `training/notebooks/HerbVision_EfficientDet_Colab.ipynb`.
3. Set runtime to GPU (`Runtime > Change runtime type > T4 GPU`).
4. Mount your Google Drive containing the leaf images.
5. Execute all cells to train and export `efficientdet_best`.
6. Download the exported model folder and copy it into `backend/models/efficientdet_best`.

## Running Locally

```bash
# Ensure GPU TensorFlow is installed
pip install tensorflow opencv-python-headless pillow numpy scikit-learn

# Run training
python -m training.training.train --epochs 50 --batch_size 16 --dataset_path ./dataset

# Run evaluation on test set
python -m training.evaluation.evaluate --model_path ../backend/models/efficientdet_best --test_dir ./dataset/test
```
