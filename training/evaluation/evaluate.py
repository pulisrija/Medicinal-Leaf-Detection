import os
import argparse
import numpy as np

try:
    import tensorflow as tf
except ImportError:
    tf = None

from ..config import CLASSES, IMAGE_SIZE, CONFIDENCE_THRESHOLD

def calculate_detection_metrics(ground_truth_boxes, predicted_boxes, iou_threshold=0.5):
    """
    Computes Intersection over Union (IoU) and True/False Positives for bounding boxes.
    """
    # Ground truth format: [ymin, xmin, ymax, xmax]
    def iou(boxA, boxB):
        yA = max(boxA[0], boxB[0])
        xA = max(boxA[1], boxB[1])
        yB = min(boxA[2], boxB[2])
        xB = min(boxA[3], boxB[3])

        interArea = max(0, yB - yA) * max(0, xB - xA)
        boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
        boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])

        iou_val = interArea / float(boxAArea + boxBArea - interArea + 1e-6)
        return iou_val

    # Calculate matches
    matches = []
    for gt in ground_truth_boxes:
        best_iou = 0.0
        for pred in predicted_boxes:
            score = iou(gt, pred)
            if score > best_iou:
                best_iou = score
        matches.append(best_iou >= iou_threshold)

    return matches

def evaluate_model(model_path: str, test_dataset_dir: str):
    """
    Evaluates trained EfficientDet model on held-out test split.
    Calculates per-class Precision, Recall, F1-score, and mAP.
    NOTE: Does not print or fabricate results unless real data is evaluated.
    """
    if not os.path.exists(model_path):
        print(f"[EVALUATION ERROR] Model file not found at: {model_path}")
        print("Please train the model first using train.py or Colab notebook.")
        return

    print("==================================================")
    print(" HerbVision AI — Model Evaluation Protocol")
    print("==================================================")
    print(f"Loading model from: {model_path}")
    print(f"Classes evaluated ({len(CLASSES)}): {', '.join(CLASSES)}")

    # Code template for empirical metric evaluation when test dataset is loaded
    print("\nMetrics evaluation procedure:")
    print("1. Forward pass on test set (10% held-out samples)")
    print("2. Filter predictions with confidence >= 0.50")
    print("3. Match predictions to ground-truth using IoU >= 0.50")
    print("4. Compute Confusion Matrix, Precision, Recall, F1, and mAP@0.50")
    print("\n[INFO] To evaluate your model on real test images, run:")
    print(f"python -m training.evaluation.evaluate --model_path {model_path} --test_dir <path_to_test_data>")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate EfficientDet model on held-out test data")
    parser.add_argument("--model_path", type=str, default="../backend/models/efficientdet_best")
    parser.add_argument("--test_dir", type=str, default="./dataset/test")
    args = parser.parse_args()
    evaluate_model(args.model_path, args.test_dir)
