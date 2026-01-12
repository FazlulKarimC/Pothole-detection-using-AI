# Pothole Detection AI - Project Roadmap

> **Goal**: Research-oriented pothole detection web app for ML engineering roles

## Quick Reference

| Decision | Choice |
|----------|--------|
| Dataset | **ikigai Pothole V2** (1,481 augmented images, 640×640) |
| Models | **YOLOv8s + YOLOv9c + YOLOv10s + YOLOv11s** (balanced variants) |
| Training | Google Colab **GPU** (free tier), **50 epochs** |
| Inference | Hugging Face Gradio Space |
| Frontend | Next.js **latest** (Vercel free tier) |
| Local Downloads | **None** - keep local machine clean |

---

## Training Constraints ⚡

> Optimized for free Colab — balanced speed & performance

### ✅ What We're Doing
| Setting | Value | Reason |
|---------|-------|--------|
| Epochs | **50** | Enough to converge, not overkill |
| Model variants | **Small (s/c)** | Best speed/accuracy trade-off |
| Image size | **640** | Standard, balanced |
| Early stopping | **patience=15** | Stop if plateaued |
| Batch size | **16** | Balanced memory/speed |
| Runs per model | **1** | Accept results, document honestly |

### ❌ What to Avoid
- Training > 50 epochs
- Multiple dataset combinations
- Hyperparameter sweeps
- Repeated restarts "just for accuracy"

### Model Variants Chosen
| Model | Variant | Params | Training Time |
|-------|---------|--------|---------------|
| YOLOv8 | **small (s)** | 11.2M | ~45-60 min |
| YOLOv9 | **compact (c)** | 25M | ~60-90 min |
| YOLOv10 | **small (s)** | 8M | ~45-60 min |
| YOLOv11 | **small (s)** | 9.4M | ~45-60 min |

---

## PHASE 1: Data Preparation (Colab Only) ✅ COMPLETE
**Time**: ~15-20 min

- [x] 1.1 Create Roboflow account (free tier)
- [x] 1.2 In Colab: Download **ikigai Pothole V2** dataset via API
- [x] 1.3 In Colab: Verify dataset structure (train/valid/test splits)
- [x] 1.4 Document dataset stats for DATA_CARD.md

**Dataset Used**: ikigai Pothole V2 (workspace: ikigai, project: pothole-v2-m6ldn, version: 22)
- Source: 617 images → Augmented: 1,481 images
- License: CC BY 4.0

---

## PHASE 2: Model Training & Comparison (Colab) ✅ COMPLETE
**Time**: ~4-5 hours (all 4 models)

- [x] 2.1 Create `model_comparison.ipynb` Colab notebook
- [x] 2.2 Set up GPU runtime
- [x] 2.3 Install ultralytics framework
- [x] 2.4 Training config (all models):
  ```python
  model.train(
      data='data.yaml',
      epochs=50,
      imgsz=640,
      batch=16,
      patience=15,      # Early stopping
      cache=True,       # Faster loading  
      amp=True,         # Mixed precision
      workers=2,
  )
  ```
- [x] 2.5 **Train YOLOv8s** (~45-60 min)
- [x] 2.6 **Train YOLOv9c** (~60-90 min)
- [x] 2.7 **Train YOLOv10s** (~45-60 min)
- [x] 2.8 **Train YOLOv11s** (~45-60 min)
- [x] 2.9 Evaluate all 4 on test set
- [x] 2.10 Collect metrics: mAP@50, mAP@50-95, precision, recall, latency, size
- [x] 2.11 Generate comparison charts
- [x] 2.12 Select best model, document reasoning
- [x] 2.13 Export best model to Google Drive

**Result**: YOLOv8s selected (mAP@50: 79.2%, Recall: 71.7%)

---

## PHASE 3: ML Documentation ✅ COMPLETE
**Time**: ~2-3 hours

- [x] 3.1 `docs/MODEL_CARD.md` - architecture, training config, metrics
- [x] 3.2 `docs/DATA_CARD.md` - Roboflow source, distribution, limitations
- [x] 3.3 `docs/COMPARISON.md` - v8 vs v9 vs v10 vs v11 analysis with charts
- [x] 3.4 Failure mode analysis:
  - Shadows resembling potholes
  - Puddles/wet patches (false positives)
  - Cracks vs potholes confusion
  - Low-light/night conditions

---

## PHASE 4: Hugging Face Deployment ✅ COMPLETE
**Time**: ~1.5 hours

- [x] 4.1 Create Hugging Face Gradio Space
- [x] 4.2 Write `app.py` with:
  - Confidence threshold slider (0.1 - 0.9)
  - Severity score: `sum(box_area × confidence) / image_area`
  - Return: annotated image, JSON detections, severity, latency
- [x] 4.3 Upload best model, test API
- [x] 4.4 Add `.gitattributes` for LFS (model files)

**Deployed**: https://huggingface.co/spaces/faz-ai/pothole_detection

---

## PHASE 5: Next.js Frontend ✅ COMPLETE
**Time**: ~4-5 hours

- [x] 5.1 Initialize Next.js project (latest version)
- [x] 5.2 Minimal aesthetic UI components:
  - Image upload (drag/drop, 3MB validation)
  - Detection canvas with bounding boxes
  - Results panel: count, avg confidence, **severity meter**
  - Confidence slider with **precision-recall explanation**
    - Lower threshold → higher recall (catch all, more false alarms)
    - Higher threshold → higher precision (fewer false alarms, may miss)
- [x] 5.3 `/api/detect` route (proxy to HF Space)
- [x] 5.4 Sample images for demo (4 preloaded)
- [x] 5.5 Error handling:
  - **Cold start**: "Model warming up..." (30-60s first request)
  - Rate limit messages
  - File validation errors

**Deployed**: http://localhost:3000 (dev)

---

## PHASE 6: Deploy & Polish
**Time**: ~2-3 hours

- [ ] 6.1 Deploy to Vercel
- [ ] 6.2 Research-style README.md
- [ ] 6.3 Demo GIF
- [ ] 6.4 Clean legacy files
- [ ] 6.5 Add `.gitignore`:
  ```
  *.pt
  *.onnx
  __pycache__/
  .next/
  node_modules/
  ```

---

## Total: ~13-17 hours

| Phase | Time |
|-------|------|
| Data Prep | 15-20 min |
| Training (3 models) | 3-4 hours |
| Documentation | 2-3 hours |
| HF Deployment | 1-2 hours |
| Frontend | 4-5 hours |
| Polish | 2-3 hours |

---

## Colab Workflow Summary

```
1. Open Colab, set GPU/TPU runtime
2. Download Roboflow dataset via API (one command)
3. Train YOLOv8s, v9c, v10s (50 epochs each)
4. Compare metrics, pick best
5. Save best model to Drive
6. Download only final model for HF deployment
```

**Local machine stays 100% clean** ✅

---

## Files to Discard/Archive

| File | Action |
|------|--------|
| `pothole.pt` | Archive (prior work reference) |
| `PDA colab code.ipynb` | Replace with `model_comparison.ipynb` |
| `pothole_dataset/` | Keep for reference, not for training |

---

## Resume-Worthy Highlights

- ✅ 4-model systematic comparison (YOLOv8/v9/v10/v11)
- ✅ Standard benchmark dataset (reproducible)
- ✅ Scientific documentation (MODEL_CARD, DATA_CARD, COMPARISON)
- ✅ Failure mode analysis (honest limitations)
- ✅ Precision-recall trade-off UI
- ✅ Production metrics (latency, severity score)
- ✅ Efficient training strategy (balanced, no overkill)
- ✅ End-to-end: Data → Training → Deployment → Demo
