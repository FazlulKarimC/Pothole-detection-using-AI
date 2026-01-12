"""
Pothole Detection API - Hugging Face Gradio Space
YOLOv8s model trained on ikigai Pothole V2 dataset
"""

import gradio as gr
import numpy as np
from PIL import Image
import time
import json
from ultralytics import YOLO

# Load model at startup
MODEL_PATH = "best.pt"
model = YOLO(MODEL_PATH)


def calculate_severity(detections: list, image_width: int, image_height: int) -> float:
    """
    Calculate severity score based on detection coverage and confidence.
    
    Formula: sum(box_area × confidence) / image_area × scale_factor
    Returns: 0-10 severity score
    """
    if not detections:
        return 0.0
    
    image_area = image_width * image_height
    weighted_area_sum = 0.0
    
    for det in detections:
        box = det["box"]
        box_width = box["x2"] - box["x1"]
        box_height = box["y2"] - box["y1"]
        box_area = box_width * box_height
        weighted_area_sum += box_area * det["confidence"]
    
    # Normalize to 0-10 scale (assuming max 30% coverage with high confidence = 10)
    severity = (weighted_area_sum / image_area) * 33.33
    return min(round(severity, 2), 10.0)


def detect_potholes(image: Image.Image, confidence_threshold: float):
    """
    Detect potholes in the input image.
    
    Args:
        image: PIL Image to analyze
        confidence_threshold: Minimum confidence for detections (0.1-0.9)
    
    Returns:
        annotated_image: Image with bounding boxes
        detections_json: JSON string with detection details
        severity_text: Severity score description
        latency_text: Inference time in ms
    """
    if image is None:
        return None, "No image provided", "N/A", "N/A"
    
    start_time = time.time()
    
    # Convert to numpy array if needed
    if isinstance(image, Image.Image):
        image_np = np.array(image)
    else:
        image_np = image
    
    # Run inference
    results = model.predict(
        source=image_np,
        conf=confidence_threshold,
        verbose=False
    )[0]
    
    # Calculate latency
    latency_ms = (time.time() - start_time) * 1000
    
    # Extract detections
    detections = []
    boxes = results.boxes
    
    for i, box in enumerate(boxes):
        xyxy = box.xyxy[0].cpu().numpy()
        conf = float(box.conf[0].cpu().numpy())
        
        detection = {
            "id": i + 1,
            "class": "pothole",
            "confidence": round(conf, 3),
            "box": {
                "x1": int(xyxy[0]),
                "y1": int(xyxy[1]),
                "x2": int(xyxy[2]),
                "y2": int(xyxy[3])
            }
        }
        detections.append(detection)
    
    # Get image dimensions
    img_height, img_width = image_np.shape[:2]
    
    # Calculate severity
    severity = calculate_severity(detections, img_width, img_height)
    
    # Create annotated image
    annotated_image = results.plot()
    
    # Prepare outputs
    output_data = {
        "count": len(detections),
        "detections": detections,
        "severity": severity,
        "image_size": {"width": img_width, "height": img_height},
        "confidence_threshold": confidence_threshold,
        "latency_ms": round(latency_ms, 2)
    }
    
    # Severity description
    if severity == 0:
        severity_desc = "✅ No potholes detected"
    elif severity < 2:
        severity_desc = f"🟢 Low severity ({severity}/10)"
    elif severity < 5:
        severity_desc = f"🟡 Moderate severity ({severity}/10)"
    elif severity < 8:
        severity_desc = f"🟠 High severity ({severity}/10)"
    else:
        severity_desc = f"🔴 Critical severity ({severity}/10)"
    
    latency_text = f"⚡ {round(latency_ms, 1)} ms"
    
    return (
        annotated_image,
        json.dumps(output_data, indent=2),
        severity_desc,
        latency_text
    )


# Create Gradio interface
with gr.Blocks(title="Pothole Detection AI") as demo:
    gr.Markdown("""
    # 🕳️ Pothole Detection AI
    
    **YOLOv8s model** trained on ikigai Pothole V2 dataset (1,481 images)
    
    Upload a road image to detect potholes. Adjust confidence threshold to balance precision vs recall.
    - **Lower threshold** → More detections (higher recall, may include false positives)
    - **Higher threshold** → Fewer detections (higher precision, may miss some)
    """)
    
    with gr.Row():
        with gr.Column(scale=1):
            input_image = gr.Image(
                label="📷 Upload Road Image",
                type="pil",
                height=400
            )
            confidence_slider = gr.Slider(
                minimum=0.1,
                maximum=0.9,
                value=0.5,
                step=0.05,
                label="🎯 Confidence Threshold",
                info="Lower = more detections, Higher = fewer false positives"
            )
            detect_btn = gr.Button("🔍 Detect Potholes", variant="primary", size="lg")
        
        with gr.Column(scale=1):
            output_image = gr.Image(
                label="🎯 Detection Results",
                height=400
            )
            with gr.Row():
                severity_output = gr.Textbox(
                    label="📊 Severity",
                    interactive=False
                )
                latency_output = gr.Textbox(
                    label="⚡ Latency",
                    interactive=False
                )
            json_output = gr.Code(
                label="📋 Detection Details (JSON)",
                language="json",
                lines=10
            )
    
    # Connect the button
    detect_btn.click(
        fn=detect_potholes,
        inputs=[input_image, confidence_slider],
        outputs=[output_image, json_output, severity_output, latency_output]
    )
    
    gr.Markdown("""
    ---
    **Model Info**: YOLOv8s | mAP@50: 79.2% | Recall: 71.7% | [Documentation](https://github.com/faz-ai/pothole-detection)
    """)


if __name__ == "__main__":
    demo.launch(theme=gr.themes.Soft(), ssr_mode=False)
