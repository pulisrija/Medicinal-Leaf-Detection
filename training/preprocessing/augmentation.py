try:
    import tensorflow as tf
except ImportError:
    tf = None

def build_augmentation_layer():
    """
    Creates a robust Keras data augmentation pipeline specifically
    tuned for medicinal leaf specimen variations (angles, lighting, scale).
    """
    if tf is None:
        return None

    return tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal_and_vertical"),
        tf.keras.layers.RandomRotation(factor=0.15),  # ~ +/- 25 degrees
        tf.keras.layers.RandomZoom(height_factor=(-0.1, 0.1)),
        tf.keras.layers.RandomContrast(factor=0.2),
        tf.keras.layers.RandomBrightness(factor=0.2),
    ], name="leaf_augmentation_pipeline")

def augment_image_and_box(image, box):
    """
    Simultaneously transforms image and bounding box coordinates [ymin, xmin, ymax, xmax]
    to prevent misalignment during deep learning training.
    """
    if tf is None:
        return image, box

    # 50% chance horizontal flip
    if tf.random.uniform([]) > 0.5:
        image = tf.image.flip_left_right(image)
        # Flip horizontal coordinates
        xmin = 1.0 - box[3]
        xmax = 1.0 - box[1]
        box = tf.stack([box[0], xmin, box[2], xmax])

    return image, box
