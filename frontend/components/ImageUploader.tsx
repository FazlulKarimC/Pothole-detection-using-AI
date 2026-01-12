"use client";

import { useCallback, useState } from "react";

interface ImageUploaderProps {
    onImageSelect: (file: File) => void;
    disabled?: boolean;
    externalPreview?: string | null;
}

export default function ImageUploader({ onImageSelect, disabled, externalPreview }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const validateFile = (file: File): string | null => {
        const maxSize = 3 * 1024 * 1024; // 3MB
        const validTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!validTypes.includes(file.type)) {
            return "Please upload JPG, PNG, or WebP images only";
        }
        if (file.size > maxSize) {
            return "Image must be under 3MB";
        }
        return null;
    };

    const handleFile = useCallback((file: File) => {
        const err = validateFile(file);
        if (err) {
            setError(err);
            return;
        }
        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        onImageSelect(file);
    }, [onImageSelect]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="w-full">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
          upload-zone relative rounded-xl border-2 border-dashed p-8
          flex flex-col items-center justify-center gap-4 cursor-pointer
          min-h-[280px] transition-all
          ${isDragging ? "dragging border-blue-500 bg-blue-50" : "border-border"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-400"}
        `}
            >
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleInputChange}
                    disabled={disabled}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {(externalPreview || preview) ? (
                    <img
                        src={externalPreview || preview || ""}
                        alt="Preview"
                        className="max-h-[200px] max-w-full rounded-lg object-contain"
                    />
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="font-medium">Drop image here or click to browse</p>
                            <p className="text-sm text-muted mt-1">JPG, PNG, WebP (max 3MB)</p>
                        </div>
                    </>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}
