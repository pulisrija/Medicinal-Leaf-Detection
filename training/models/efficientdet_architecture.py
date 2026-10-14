from typing import Tuple, List

try:
    import tensorflow as tf
    from tensorflow.keras import layers, models
except ImportError:
    tf = None
    layers = None
    models = None

def build_bifpn_layer(features: List, num_channels: int = 64, name_prefix: str = "bifpn"):
    """
    Implements a single BiFPN (Bidirectional Feature Pyramid Network) cell.
    Features input: [P3, P4, P5, P6, P7]
    Performs top-down and bottom-up multi-scale bidirectional feature fusion.
    """
    P3_in, P4_in, P5_in, P6_in, P7_in = features

    # Top-down pathway
    P7_td = P7_in
    P6_td = layers.Conv2D(num_channels, 1, padding='same', name=f"{name_prefix}_p6_td_conv")(
        layers.Add()([P6_in, layers.UpSampling2D(2)(P7_td)])
    )
    P5_td = layers.Conv2D(num_channels, 1, padding='same', name=f"{name_prefix}_p5_td_conv")(
        layers.Add()([P5_in, layers.UpSampling2D(2)(P6_td)])
    )
    P4_td = layers.Conv2D(num_channels, 1, padding='same', name=f"{name_prefix}_p4_td_conv")(
        layers.Add()([P4_in, layers.UpSampling2D(2)(P5_td)])
    )
    P3_out = layers.Conv2D(num_channels, 3, padding='same', activation='swish', name=f"{name_prefix}_p3_out")(
        layers.Add()([P3_in, layers.UpSampling2D(2)(P4_td)])
    )

    # Bottom-up pathway
    P4_out = layers.Conv2D(num_channels, 3, padding='same', activation='swish', name=f"{name_prefix}_p4_out")(
        layers.Add()([P4_in, P4_td, layers.MaxPooling2D(2)(P3_out)])
    )
    P5_out = layers.Conv2D(num_channels, 3, padding='same', activation='swish', name=f"{name_prefix}_p5_out")(
        layers.Add()([P5_in, P5_td, layers.MaxPooling2D(2)(P4_out)])
    )
    P6_out = layers.Conv2D(num_channels, 3, padding='same', activation='swish', name=f"{name_prefix}_p6_out")(
        layers.Add()([P6_in, P6_td, layers.MaxPooling2D(2)(P5_out)])
    )
    P7_out = layers.Conv2D(num_channels, 3, padding='same', activation='swish', name=f"{name_prefix}_p7_out")(
        layers.Add()([P7_in, layers.MaxPooling2D(2)(P6_out)])
    )

    return [P3_out, P4_out, P5_out, P6_out, P7_out]

def build_efficientdet_d0(
    input_shape: Tuple[int, int, int] = (512, 512, 3),
    num_classes: int = 10,
    bifpn_channels: int = 64,
    num_bifpn_repeats: int = 3
):
    """
    Constructs EfficientDet-D0 architecture:
    1. Backbone: EfficientNetB0 (pretrained on ImageNet)
    2. BiFPN: Repeated bidirectional feature fusion across P3-P7
    3. Classification & Bounding Box Subnets
    """
    if tf is None:
        raise RuntimeError("TensorFlow is required to instantiate the EfficientDet model.")

    inputs = layers.Input(shape=input_shape, name="input_leaf_image")

    # 1. EfficientNetB0 Backbone
    backbone = tf.keras.applications.EfficientNetB0(
        include_top=False,
        weights="imagenet",
        input_tensor=inputs
    )

    # Extract multi-scale feature maps from backbone stages:
    # P3: resolution 64x64, stage 3
    # P4: resolution 32x32, stage 4
    # P5: resolution 16x16, stage 6
    p3_raw = backbone.get_layer("block3b_add").output
    p4_raw = backbone.get_layer("block5c_add").output
    p5_raw = backbone.get_layer("top_activation").output

    # Project to uniform BiFPN channel width
    p3 = layers.Conv2D(bifpn_channels, 1, padding="same", name="p3_projection")(p3_raw)
    p4 = layers.Conv2D(bifpn_channels, 1, padding="same", name="p4_projection")(p4_raw)
    p5 = layers.Conv2D(bifpn_channels, 1, padding="same", name="p5_projection")(p5_raw)

    # Generate P6 (1/64) and P7 (1/128) using downsampling convolutions
    p6 = layers.Conv2D(bifpn_channels, 3, strides=2, padding="same", name="p6_generator")(p5)
    p7 = layers.MaxPooling2D(pool_size=3, strides=2, padding="same", name="p7_generator")(p6)

    features = [p3, p4, p5, p6, p7]

    # 2. Repeated BiFPN Fusion Layers
    for repeat in range(num_bifpn_repeats):
        features = build_bifpn_layer(features, num_channels=bifpn_channels, name_prefix=f"bifpn_{repeat+1}")

    # 3. Heads: Classification Subnet & Bounding Box Subnet
    # Global multi-scale aggregation
    pooled_p3 = layers.GlobalAveragePooling2D()(features[0])
    pooled_p4 = layers.GlobalAveragePooling2D()(features[1])
    pooled_p5 = layers.GlobalAveragePooling2D()(features[2])
    pooled_p6 = layers.GlobalAveragePooling2D()(features[3])
    pooled_p7 = layers.GlobalAveragePooling2D()(features[4])

    fused_embedding = layers.Concatenate(name="multiscale_fused_features")(
        [pooled_p3, pooled_p4, pooled_p5, pooled_p6, pooled_p7]
    )
    fused_dense = layers.Dense(256, activation="swish")(fused_embedding)
    fused_dense = layers.Dropout(0.2)(fused_dense)

    # Head 1: Medicinal Plant Class Logits / Probabilities
    class_outputs = layers.Dense(num_classes, activation="softmax", name="plant_classification_head")(fused_dense)

    # Head 2: Leaf Bounding Box Regression [ymin, xmin, ymax, xmax]
    box_dense = layers.Dense(128, activation="swish")(fused_embedding)
    box_outputs = layers.Dense(4, activation="sigmoid", name="leaf_box_head")(box_dense)

    model = models.Model(
        inputs=inputs,
        outputs={"classification": class_outputs, "bounding_box": box_outputs},
        name="EfficientDet_D0_Medicinal_Leaf"
    )

    return model
