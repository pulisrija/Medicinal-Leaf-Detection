import io
from typing import Tuple
from PIL import Image, UnidentifiedImageError
import numpy as np

def validate_and_load_image(file_bytes: bytes, max_file_size_mb: int = 15) -> Image.Image:
    """
    Validates uploaded file size and parses into a valid PIL RGB Image.
    Raises ValueError on corrupt or unsupported images.
    """
    if not file_bytes or len(file_bytes) == 0:
        raise ValueError("Uploaded image file is empty.")

    file_size_mb = len(file_bytes) / (1024 * 1024)
    if file_size_mb > max_file_size_mb:
        raise ValueError(f"Image file size ({file_size_mb:.2f} MB) exceeds maximum allowed {max_file_size_mb} MB.")

    try:
        image = Image.open(io.BytesIO(file_bytes))
        image.verify()  # Verify integrity
        # Reopen after verify
        image = Image.open(io.BytesIO(file_bytes))
        image = image.convert("RGB")
        return image
    except (UnidentifiedImageError, OSError, Exception) as e:
        raise ValueError(f"Corrupt or invalid image file: {str(e)}")

def preprocess_for_efficientdet(
    image: Image.Image,
    target_size: int = 512
) -> Tuple[np.ndarray, Tuple[int, int], float]:
    """
    Prepares image for EfficientDet:
    - Maintains aspect ratio with letterboxing or standard resize
    - Normalizes values to [0, 1] range
    - Returns preprocessed array with batch dimension (1, H, W, 3)
    """
    orig_w, orig_h = image.size
    
    # Calculate scale for letterboxing
    scale = min(target_size / orig_w, target_size / orig_h)
    new_w = int(orig_w * scale)
    new_h = int(orig_h * scale)
    
    resized = image.resize((new_w, new_h), Image.Resampling.BILINEAR)
    
    # Create target padded canvas
    padded_img = Image.new("RGB", (target_size, target_size), (128, 128, 128))
    pad_x = (target_size - new_w) // 2
    pad_y = (target_size - new_h) // 2
    padded_img.paste(resized, (pad_x, pad_y))
    
    img_array = np.array(padded_img, dtype=np.float32) / 255.0
    batch_tensor = np.expand_dims(img_array, axis=0)
    
    return batch_tensor, (orig_w, orig_h), scale
