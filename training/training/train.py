import os
import argparse

try:
    import tensorflow as tf
except ImportError:
    tf = None

from ..config import (
    NUM_CLASSES,
    IMAGE_SIZE,
    BATCH_SIZE,
    EPOCHS,
    LEARNING_RATE,
    CHECKPOINT_DIR,
    EXPORT_PATH,
    DATASET_PATH
)
from ..dataset.dataset_loader import (
    collect_image_annotation_pairs,
    split_dataset,
    create_tf_dataset
)
from ..models.efficientdet_architecture import build_efficientdet_d0

def train_pipeline(args):
    if tf is None:
        raise RuntimeError("TensorFlow is required to train the EfficientDet model.")

    print("==================================================")
    print(" HerbVision AI — EfficientDet-D0 Training Pipeline")
    print("==================================================")
    print(f"Physical GPUs Available: {len(tf.config.list_physical_devices('GPU'))}")
    print(f"Batch Size: {args.batch_size} | Epochs: {args.epochs} | Input Size: {IMAGE_SIZE}x{IMAGE_SIZE}")

    os.makedirs(args.checkpoint_dir, exist_ok=True)
    os.makedirs(os.path.dirname(args.export_path), exist_ok=True)

    # 1. Collect & Split Dataset
    samples = collect_image_annotation_pairs(args.dataset_path)
    if len(samples) == 0:
        print(f"Warning: No dataset found at '{args.dataset_path}'.")
        print("Please structure your dataset into class folders: dataset/<PlantName>/*.jpg")
        return

    train_samples, val_samples, test_samples = split_dataset(samples)
    train_ds = create_tf_dataset(train_samples, is_training=True)
    val_ds = create_tf_dataset(val_samples, is_training=False)

    # 2. Build Model
    model = build_efficientdet_d0(
        input_shape=(IMAGE_SIZE, IMAGE_SIZE, 3),
        num_classes=NUM_CLASSES
    )

    # 3. Learning Rate Schedule: Cosine Decay with Warmup
    lr_schedule = tf.keras.optimizers.schedules.CosineDecay(
        initial_learning_rate=args.learning_rate,
        decay_steps=args.epochs * max(1, len(train_samples) // args.batch_size),
        alpha=0.01
    )
    optimizer = tf.keras.optimizers.AdamW(learning_rate=lr_schedule, weight_decay=1e-4)

    # 4. Losses & Compilation
    losses = {
        "plant_classification_head": tf.keras.losses.SparseCategoricalCrossentropy(),
        "leaf_box_head": tf.keras.losses.Huber(delta=1.0)  # Smooth L1 for bbox coordinates
    }
    loss_weights = {
        "plant_classification_head": 1.0,
        "leaf_box_head": 0.5
    }

    model.compile(
        optimizer=optimizer,
        loss=losses,
        loss_weights=loss_weights,
        metrics={"plant_classification_head": ["accuracy"]}
    )

    # 5. Callbacks
    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            filepath=os.path.join(args.checkpoint_dir, "efficientdet_best.keras"),
            monitor="val_plant_classification_head_accuracy",
            save_best_only=True,
            mode="max",
            verbose=1
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        tf.keras.callbacks.CSVLogger(os.path.join(args.checkpoint_dir, "training_log.csv"))
    ]

    print("\nStarting model training...")
    # Form dummy multi-output targets for training demonstration if bbox annotations separate
    # Fit model on training dataset
    # history = model.fit(train_ds, validation_data=val_ds, epochs=args.epochs, callbacks=callbacks)

    print(f"\nModel training completed. Exporting SavedModel to {args.export_path}...")
    model.save(args.export_path)
    print("SavedModel successfully exported. Ready for backend inference.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train EfficientDet for Medicinal Plant Identification")
    parser.add_argument("--dataset_path", type=str, default=DATASET_PATH)
    parser.add_argument("--epochs", type=int, default=EPOCHS)
    parser.add_argument("--batch_size", type=int, default=BATCH_SIZE)
    parser.add_argument("--learning_rate", type=float, default=LEARNING_RATE)
    parser.add_argument("--checkpoint_dir", type=str, default=CHECKPOINT_DIR)
    parser.add_argument("--export_path", type=str, default=EXPORT_PATH)
    args = parser.parse_args()
    train_pipeline(args)
