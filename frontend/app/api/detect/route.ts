import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";

const HF_SPACE_URL = "https://faz-ai-pothole-detection.hf.space";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const image = formData.get("image") as File;
        const confidence = parseFloat(formData.get("confidence") as string) || 0.5;

        if (!image) {
            return NextResponse.json(
                { error: "No image provided" },
                { status: 400 }
            );
        }

        // Validate file size (3MB)
        if (image.size > 3 * 1024 * 1024) {
            return NextResponse.json(
                { error: "Image must be under 3MB" },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(image.type)) {
            return NextResponse.json(
                { error: "Please upload JPG, PNG, or WebP images only" },
                { status: 400 }
            );
        }

        // Connect to HuggingFace Gradio Space
        const client = await Client.connect(HF_SPACE_URL);

        // Convert file to blob for Gradio
        const imageBlob = new Blob([await image.arrayBuffer()], { type: image.type });

        // Call the detect_potholes function (fn_index 0 for first click handler)
        const result = await client.predict(0, [imageBlob, confidence]);

        // Extract data from result
        const data = result.data as [
            { url: string } | null, // annotated image
            string,                  // JSON detections
            string,                  // severity text
            string                   // latency text
        ];

        const [annotatedImage, detectionsJson, severityText, latencyText] = data;

        // Parse the JSON response
        let parsedDetections;
        try {
            parsedDetections = JSON.parse(detectionsJson);
        } catch {
            parsedDetections = { count: 0, detections: [], severity: 0, latency_ms: 0 };
        }

        return NextResponse.json({
            success: true,
            annotated_image: annotatedImage?.url || null,
            count: parsedDetections.count || 0,
            detections: parsedDetections.detections || [],
            severity: parsedDetections.severity || 0,
            latency_ms: parsedDetections.latency_ms || 0,
            severity_text: severityText,
            latency_text: latencyText,
        });

    } catch (error) {
        console.error("Detection error:", error);

        // Check for specific error types
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (errorMessage.includes("timeout") || errorMessage.includes("ETIMEDOUT")) {
            return NextResponse.json(
                {
                    error: "Model is warming up. Please try again in 30-60 seconds.",
                    is_cold_start: true
                },
                { status: 503 }
            );
        }

        if (errorMessage.includes("rate limit") || errorMessage.includes("429")) {
            return NextResponse.json(
                { error: "Too many requests. Please wait a moment." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "Detection service temporarily unavailable. Please try again." },
            { status: 500 }
        );
    }
}

// Increase timeout for cold starts
export const maxDuration = 90;
