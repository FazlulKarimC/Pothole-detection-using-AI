# Pothole Detection Dataset Card

## Dataset Overview

| Property | Value |
|----------|-------|
| **Name** | ikigai Pothole V2 |
| **Source** | [Roboflow Universe](https://universe.roboflow.com/ikigai/pothole-v2-m6ldn) |
| **Version** | 22 (with augmentations) |
| **Format** | YOLOv8 |
| **Classes** | 1 (pothole) |
| **License** | CC BY 4.0 |

## Dataset Statistics

| Split | Images | % |
|-------|--------|---|
| Train | 1,296 | 88% |
| Valid | 123 | 8% |
| Test  | 62 | 4% |
| **Total** | **1,481** | 100% |

### Source vs Augmented
- **Original source images**: 617
- **After augmentation**: 1,481 (3x generation)

### Annotation Stats
- **Annotation format**: YOLO (x_center, y_center, width, height - normalized)

## Image Properties

| Property | Value |
|----------|-------|
| Resolution | 640×640 (pre-resized) |
| Color | RGB |
| File format | JPG |

## Preprocessing Applied
- Auto-Orient
- Resize: Stretched to 640×640

## Augmentations Applied
- Horizontal Flip
- Brightness: ±15%
- Exposure: ±15%

## Benchmark Performance

Best model: **YOLOv8s** (see [COMPARISON.md](./COMPARISON.md) for full analysis)

| Metric | Value |
|--------|-------|
| **mAP@50** | 79.2% |
| **mAP@50-95** | 44.7% |
| **Precision** | 78.4% |
| **Recall** | 71.7% |

## Known Limitations

1. **Shadows** - May be confused with potholes
2. **Puddles/wet patches** - Potential false positives
3. **Cracks vs potholes** - Similar appearance
4. **Low-light/night** - Limited representation

## Citation

Dataset from Roboflow Universe by ikigai.
License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
