# Academic Project Report Documentation

## Project Title
**An Intelligent Deep Learning System for Medicinal Plant Classification and Herbal Remedy Recommendation**

- **Project Type:** B.Tech Mini Project Report
- **Department:** Department of Information Technology
- **Institution:** Anurag University, Hyderabad, Telangana
- **Authors:** Sankeerthana G, P. Srija, V. Shirisha
- **Guide:** Mr. B. Ravi Raju, Assistant Professor

---

## 1. Abstract
The Indian subcontinent harbors a profound repository of traditional ethnobotanical knowledge, notably across Ayurvedic, Siddha, and Unani medical traditions. However, the accurate identification of indigenous medicinal flora in natural habitats presents substantial challenges due to inter-species morphological similarities, intra-species foliar variances, and a decline in traditional taxonomic knowledge. This project proposes and implements **HerbVision AI**, an intelligent deep learning system engineered to detect and classify Indian medicinal plant species from leaf photographs using an **EfficientDet** architecture and subsequently recommend traditional herbal remedies from a structured ethnobotanical repository. 

Unlike conventional image classification systems that process entire unsegmented frames—thereby suffering from background interference—the proposed system utilizes EfficientDet's compound-scaled EfficientNet-B0 backbone coupled with repeated Bidirectional Feature Pyramid Networks (BiFPN) to localize the leaf blade with precise bounding box coordinates and classify the species. The platform integrates a high-performance Python FastAPI backend, a responsive React and TypeScript frontend, a confidence safety threshold ($\tau = 0.50$), visual feature saliency interpretability, and a structured knowledge base encompassing 10 therapeutic plant species.

---

## 2. Introduction
Plants form the bedrock of traditional pharmacopoeia and contemporary drug discovery. More than 70% of the rural population in developing nations relies on botanical preparations for primary healthcare. Automated botanical recognition bridges the gap between traditional wisdom and modern mobile intelligence. Recent advances in deep learning, particularly convolutional neural networks (CNNs) and feature pyramid architectures, enable high-precision visual recognition. This project delivers an end-to-end software pipeline that translates raw leaf photography into actionable, culturally grounded ethnobotanical intelligence.

---

## 3. Problem Statement
Manual plant identification demands specialized botanical expertise and dichotomous taxonomic keys, which are inaccessible to laypersons. Existing mobile applications often rely on generic image classifiers that frequently misidentify leaves against complex backgrounds (such as hands, forest floors, or varying sunlight). Furthermore, misidentifying medicinal species can pose severe health hazards due to the potential toxicity of lookalike plants. There is a distinct absence of unified systems that combine:
1. Object detection to isolate the leaf from ambient noise.
2. Safe confidence-gated species classification.
3. Culturally authentic, verified Ayurvedic and ethnobotanical guidance with transparent medical disclaimers.

---

## 4. Existing System vs. Proposed System

### 4.1 Existing Systems
- Primarily rely on standard whole-image CNN classifiers (e.g., standard ResNet or MobileNet).
- Fail when the background contains competing foliage, soil, or fingers holding the leaf.
- Do not localize the leaf blade or provide spatial bounding boxes.
- Lack ethnobotanical contextualization, offering only scientific names without preparation methods, parts used, or precautions.
- Provide no confidence gating, presenting uncertain predictions with misleading certainty.

### 4.2 Proposed System (HerbVision AI)
- **Object Detection via EfficientDet:** Isolates the leaf specimen with bounding box regression $[x_1, y_1, x_2, y_2]$.
- **BiFPN Multi-Scale Fusion:** Seamlessly captures fine vein reticulations and global leaf blade geometry across levels P3 through P7.
- **Safety Confidence Gating:** Enforces a $0.50$ threshold; unconfident images trigger a constructive prompt for a clearer photograph.
- **Visual Interpretability:** Highlights key visual attention zones (serrated margin, midrib, apex).
- **Ethnobotanical Repository:** Provides verified traditional preparations, active phytochemical markers, parts used, and clear safety contraindications.
- **Decoupled Architecture:** Dual-engine design separating UI testing (mock simulation) from production deep learning inference (FastAPI + TensorFlow).

---

## 5. Objectives
1. Design and train an EfficientDet deep learning model on 10 Indian medicinal plant leaf species.
2. Formulate a clean data preprocessing and augmentation pipeline preserving bounding box geometries.
3. Build a high-throughput REST API using FastAPI.
4. Construct an accessible, responsive web application adhering to professional UI design standards.
5. Create a structured ethnobotanical knowledge base formatted in decoupled JSON.
6. Enforce strict medical and educational disclaimers to prevent unsupervised clinical usage.

---

## 6. Methodology
The research and development methodology follows a 5-stage sequential engineering pipeline:
1. **Dataset Acquisition & Stratified Partitioning:** Assembly of leaf specimens across 10 classes, divided into 70% Train, 20% Validation, and 10% Test sets to eliminate data leakage.
2. **Preprocessing & Geometric Augmentation:** Resizing with aspect-preserving letterboxing to 512×512, RGB normalization, and synchronous coordinate transformation.
3. **Deep Learning Model Construction:** EfficientNet-B0 backbone feature extraction with 3 repeated BiFPN fusion blocks and dual prediction heads.
4. **Backend API Engineering:** FastAPI service managing image ingestion, tensor transformation, inference orchestration, and knowledge lookup.
5. **Frontend Client Implementation:** React + TypeScript application with interactive bounding box visualization and ethnobotanical presentation.

---

## 7. Deep Learning Architecture: EfficientDet-D0

### 7.1 EfficientNet Backbone
The feature extraction backbone is EfficientNet-B0, developed using neural architecture search (NAS) and compound scaling. It extracts hierarchical feature maps:
- **P3 ($64 \times 64$, stage 3):** High-resolution, low-level features (leaf margin serrations, trichome texture).
- **P4 ($32 \times 32$, stage 4):** Medium-resolution features (secondary venation, lateral veins).
- **P5 ($16 \times 16$, stage 6):** Low-resolution, high-level semantic features (leaf shape, apex contour).

### 7.2 Bidirectional Feature Pyramid Network (BiFPN)
Traditional Feature Pyramid Networks (FPN) are constrained by unidirectional top-down information flow. BiFPN introduces:
1. **Bidirectional Connections:** Combines top-down and bottom-up pathways to fuse multi-scale features repeatedly.
2. **Weighted Feature Fusion:** Applies learnable weights to emphasize resolution levels carrying greater botanical saliency.
3. **Residual Skip Connections:** Connects original input nodes directly to output nodes at the same scale to preserve spatial gradients.

### 7.3 Prediction Heads
- **Classification Subnetwork:** Multi-layer separable convolutions terminating in a softmax layer across 10 classes, optimized via Focal Loss.
- **Box Regression Subnetwork:** Predicts 4 normalized box coordinates $[y_{\min}, x_{\min}, y_{\max}, x_{\max}]$, trained using Smooth L1 (Huber) loss.

---

## 8. Dataset Description & Preprocessing
The initial prototype supports 10 medicinal species:
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

### Preprocessing Protocol
- **Input Dimensions:** $512 \times 512 \times 3$
- **Letterbox Padding:** Prevents distortion of natural aspect ratios by centering the image and padding margins with neutral gray.
- **Channel Normalization:** Pixel values scaled to $[0.0, 1.0]$.
- **Augmentation Suite:** Horizontal/vertical flips, rotation ($\pm 20^\circ$), zoom ($\pm 10\%$), contrast/brightness variations.

---

## 9. Evaluation Protocol
In compliance with academic honesty standards, evaluation metrics must be calculated strictly on held-out test datasets:
- **Intersection over Union (IoU):** $\text{IoU} = \frac{\text{Area of Overlap}}{\text{Area of Union}}$
- **Precision:** $\frac{TP}{TP + FP}$
- **Recall:** $\frac{TP}{TP + FN}$
- **Mean Average Precision (mAP):** Area under the Precision-Recall curve across all 10 classes at $\text{IoU} \ge 0.50$ (mAP@0.50).

---

## 10. Limitations & Future Scope

### 10.1 Current Prototype Limitations
- Supported catalog restricted to 10 initial plant species.
- Optimal performance requires single, reasonably unobstructed leaf specimens.
- Highly degraded, dried, or pest-damaged specimens may yield reduced confidence.

### 10.2 Future Scope
- Expand knowledge base and training dataset to 100+ species listed under the National Medicinal Plants Board (NMPB).
- Implement multi-instance detection for whole plants, flowers, and medicinal bark.
- Quantize model using TensorFlow Lite for fully offline mobile on-device inference without internet connectivity.
- Integrate personalized Ayurvedic Dosha (Vata, Pitta, Kapha) wellness profiling.

---

## 11. Conclusion
HerbVision AI successfully illustrates the convergence of modern object detection deep learning (EfficientDet) with traditional Indian ethnobotanical wisdom. By localizing the leaf blade and providing safety-gated classifications alongside verified traditional remedies, the project delivers a reliable, educational, and technologically rigorous system suitable for academic evaluation and community botanical literacy.
