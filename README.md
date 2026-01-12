# 🛣️ AI Pothole Detection (Research & Engineering)

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Framework: Next.js](https://img.shields.io/badge/Framework-Next.js_16-black)
![Model: YOLOv8](https://img.shields.io/badge/Model-YOLOv8s-blue)
![Status: Prototype](https://img.shields.io/badge/Status-Research_Prototype-green)

> A research-oriented computer vision system for automated pothole detection, featuring a systematic comparison of YOLO architectures and a production-grade inference pipeline.

## 📑 Abstract

Road infrastructure maintenance is a critical challenge requiring timely identification of defects. This project investigates the efficacy of modern object detection models (YOLOv8, YOLOv9, YOLOv10, YOLOv11) for real-time pothole detection. By training on the **ikigai Pothole V2** dataset and evaluating on standard metrics (mAP, Precision, Recall), we developed a balanced solution optimized for free-tier cloud deployment. The final system achieves **79.2% mAP@50** using YOLOv8s, wrapped in a user-friendly generic interface that allows maintenance crews to adjust sensitivity based on operational needs.

## ✨ Key Features

- **🛡️ Multi-Model Benchmarking**: Systematic comparison of 4 state-of-the-art YOLO variants to justify architectural choices.
- **🎚️ Dynamic Sensitivity Control**: Real-time confidence threshold slider allowing users to balance Precision (fewer false alarms) vs. Recall (catching all defects).
- **⚠️ Severity Scoring**: Custom algorithm (`Area × Confidence`) to prioritize dangerous potholes for immediate repair.
- **🚀 Hybrid Architecture**: 
  - **Frontend**: Next.js (React) for a responsive, research-grade UI.
  - **Inference**: Python FastAPI specialized for tensor processing (deployed on Hugging Face Spaces).

## 🔬 Methodology & Results

We trained four model variants on 1,481 augmented images (640x640) for 50 epochs on Google Colab GPUs.

| Model Variant | Params | mAP@50 | Latency (CPU) | Verdict |
|---------------|--------|--------|---------------|---------|
| **YOLOv8s**   | 11.2M  | **79.2%** | ~40ms         | ✅ **Selected** (Best Balance) |
| YOLOv9c       | 25.0M  | 78.5%  | ~65ms         | Slower, diminishing returns |
| YOLOv10s      | 8.0M   | 76.8%  | ~35ms         | Fast, but lower accuracy |
| YOLOv11s      | 9.4M   | 77.4%  | ~38ms         | Competitive, but v8 proved more stable |

> **Selection Logic**: YOLOv8s provided the highest mean Average Precision (mAP) while maintaining acceptable inference speeds on free-tier CPU instances.

## 🛠️ Tech Stack

- **Machine Learning**: PyTorch, Ultralytics YOLO, Albumentations
- **Backend API**: FastAPI, Gradio Client, Hugging Face Spaces
- **Frontend**: Next.js 16, Tailwind CSS, Lucide React
- **DevOps**: Vercel (Frontend), Spaces (Model Hosting)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+


### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pothole-detection-ai.git
   cd pothole-detection-ai
   ```

2. **Run the Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Access the app at `http://localhost:3000`.

## 📂 Project Structure

```bash
├── frontend/             # Next.js Application
│   ├── app/              # App Router pages and API routes
│   └── components/       # Reusable UI components (Upload, Results)
├── notebooks/            # Jupyter Notebooks for Research
│   ├── data_preparation.ipynb  # Dataset download & formatting
│   └── model_comparison.ipynb  # Training & Evaluation of 4 models
├── docs/                 # Scientific Documentation
│   ├── MODEL_CARD.md     # In-depth model architecture & metrics
│   ├── DATA_CARD.md      # Dataset statistics and source info
│   └── COMPARISON.md     # Detailed plots comparing v8/v9/v10/v11
```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Developed by Fazlul Karim. Designed for ML Engineering/Research roles.*
