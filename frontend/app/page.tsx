"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import ConfidenceSlider from "@/components/ConfidenceSlider";
import ResultsPanel from "@/components/ResultsPanel";
import SampleImages from "@/components/SampleImages";

interface Detection {
  id: number;
  class: string;
  confidence: number;
  box: { x1: number; y1: number; x2: number; y2: number };
}

interface DetectionResult {
  annotated_image: string | null;
  count: number;
  detections: Detection[];
  severity: number;
  latency_ms: number;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [confidence, setConfidence] = useState(0.1);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isColdStart, setIsColdStart] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setResult(null);
    setError(null);
    // Create preview for uploaded files
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSampleSelect = async (src: string) => {
    try {
      setImagePreview(src); // Show preview immediately
      const response = await fetch(src);
      const blob = await response.blob();
      const file = new File([blob], "sample.jpg", { type: "image/jpeg" });
      setSelectedImage(file);
      setResult(null);
      setError(null);
    } catch {
      setError("Failed to load sample image");
    }
  };

  const handleDetect = async () => {
    if (!selectedImage) {
      setError("Please upload or select an image first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsColdStart(false);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("confidence", confidence.toString());

      const response = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.is_cold_start) {
          setIsColdStart(true);
        }
        throw new Error(data.error || "Detection failed");
      }

      setResult({
        annotated_image: data.annotated_image,
        count: data.count,
        detections: data.detections,
        severity: data.severity,
        latency_ms: data.latency_ms,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <span className="text-xl">🕳️</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Pothole Detection AI</h1>
                <p className="text-xs text-muted">YOLOv8s • mAP@50: 79.2%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://faz-ai-pothole-detection.hf.space/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="View on Hugging Face"
              >
                <svg className="w-6 h-6" viewBox="0 0 120 120" fill="currentColor">
                  <path d="M37.6 62.5c0-4.9 4-8.9 8.9-8.9s8.9 4 8.9 8.9-4 8.9-8.9 8.9-8.9-4-8.9-8.9zm35.9 0c0-4.9 4-8.9 8.9-8.9s8.9 4 8.9 8.9-4 8.9-8.9 8.9-8.9-4-8.9-8.9zM60 95c-13.8 0-25-11.2-25-25h10c0 8.3 6.7 15 15 15s15-6.7 15-15h10c0 13.8-11.2 25-25 25zM60 10c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z" />
                </svg>
              </a>
              <a
                href="https://github.com/FazlulKarimC/Pothole-detection-using-AI"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="View on GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left column - Input */}
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-medium mb-4">Upload Image</h2>
              <ImageUploader
                onImageSelect={handleImageSelect}
                disabled={isLoading}
                externalPreview={imagePreview}
              />
            </section>

            <section>
              <SampleImages
                onSelect={handleSampleSelect}
                disabled={isLoading}
              />
            </section>

            <section>
              <ConfidenceSlider
                value={confidence}
                onChange={setConfidence}
                disabled={isLoading}
              />
            </section>

            <button
              onClick={handleDetect}
              disabled={isLoading || !selectedImage}
              className="w-full py-3 px-6 rounded-xl font-medium text-white
                bg-blue-600 hover:bg-blue-700 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Detect Potholes
                </>
              )}
            </button>

            {/* Error message */}
            {error && (
              <div className={`p-4 rounded-xl border ${isColdStart ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800" : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{isColdStart ? "🔄" : "⚠️"}</span>
                  <div>
                    <p className={`font-medium ${isColdStart ? "text-yellow-800 dark:text-yellow-200" : "text-red-800 dark:text-red-200"}`}>
                      {isColdStart ? "Model Warming Up" : "Error"}
                    </p>
                    <p className="text-sm mt-1 text-muted">{error}</p>
                    {isColdStart && (
                      <button
                        onClick={handleDetect}
                        className="mt-2 text-sm font-medium text-blue-600 hover:underline"
                      >
                        Try again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Results */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Results</h2>

            {/* Detection image */}
            <div className="rounded-xl overflow-hidden border border-border bg-card min-h-[280px] flex items-center justify-center">
              {result?.annotated_image ? (
                <img
                  src={result.annotated_image}
                  alt="Detection result"
                  className="w-full h-auto"
                />
              ) : (
                <div className="text-center p-8 text-muted">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Detection results will appear here</p>
                </div>
              )}
            </div>

            {/* Results panel */}
            {result ? (
              <ResultsPanel
                count={result.count}
                severity={result.severity}
                latencyMs={result.latency_ms}
                detections={result.detections}
              />
            ) : isLoading ? (
              <ResultsPanel
                count={0}
                severity={0}
                latencyMs={0}
                detections={[]}
                isLoading={true}
              />
            ) : null}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-5xl mx-auto px-6 py-6 text-center text-sm text-muted">
          <p>YOLOv8s model trained on ikigai Pothole V2 dataset (1,481 images)</p>
          <p className="mt-1">mAP@50: 79.2% • Recall: 71.7%</p>
          <p className="mt-4">Made with ❤️ time and effort by <span className="font-medium text-foreground">Fazlul Karim</span></p>
        </div>
      </footer>
    </div>
  );
}
