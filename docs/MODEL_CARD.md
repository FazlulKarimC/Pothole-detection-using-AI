# Pothole Detection Model Card

## Model Details

| Property | Value |
|----------|-------|
| **Architecture** | YOLOv8s (You Only Look Once v8 - Small) |
| **Framework** | Ultralytics |
| **Parameters** | 11.2M |
| **Input Size** | 640×640 RGB |
| **Output** | Bounding boxes + confidence scores |
| **Classes** | 1 (pothole) |
| **License** | AGPL-3.0 (Ultralytics) |

## Training Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| Epochs | 50 | Sufficient for convergence |
| Batch Size | 16 | Balanced memory/speed |
| Image Size | 640 | Standard YOLO resolution |
| Patience | 15 | Early stopping threshold |
| Optimizer | AdamW | Ultralytics default |
| AMP | Enabled | Faster training |
| Cache | Enabled | Faster data loading |

**Hardware**: Google Colab T4 GPU (free tier)

## Performance Metrics

Evaluated on **test set** (62 images):

| Metric | Value |
|--------|-------|
| **mAP@50** | 0.792 (79.2%) |
| **mAP@50-95** | 0.447 (44.7%) |
| **Precision** | 0.784 (78.4%) |
| **Recall** | 0.717 (71.7%) |

### Why YOLOv8s?

Selected from 4-model comparison (v8s, v9c, v10s, v11s) based on:
- **Highest mAP@50** (79.2% vs 77.4% for runner-up)
- **Best recall** (71.7%) - critical for safety applications
- **Balanced precision-recall** trade-off

See [COMPARISON.md](./COMPARISON.md) for full analysis.

## Intended Use

### Primary Use Case
- Detect potholes in road surface images
- Input: Single road image (daylight, clear view)
- Output: Bounding boxes around detected potholes with confidence scores

### Downstream Applications
- Road maintenance prioritization
- Municipal infrastructure monitoring
- Driver safety alert systems

## Limitations & Failure Modes

### Known Failure Cases

| Condition | Risk | Mitigation |
|-----------|------|------------|
| **Shadows** | False positives | Use confidence threshold ≥0.5 |
| **Puddles/wet patches** | False positives | May need additional filtering |
| **Cracks vs potholes** | Confusion | Model trained only on potholes |
| **Low-light/night** | Reduced accuracy | Limited training data for this |
| **Unusual angles** | Miss detections | Best with overhead/dashboard view |

### Out of Scope
- Real-time video processing (not optimized)
- Depth estimation (2D detection only)
- Severity classification (binary detection only)

## Ethical Considerations

- **Bias**: Dataset primarily contains daytime, clear-weather images
- **Safety**: Should not be sole input for autonomous driving decisions
- **Deployment**: Intended as assistive tool, not replacement for human inspection

## Citation

```
Model: Ultralytics YOLOv8s
Dataset: ikigai Pothole V2 (Roboflow Universe)
Training: Google Colab (T4 GPU)
```
