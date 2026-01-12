"use client";

import Image from "next/image";

interface SampleImagesProps {
    onSelect: (imagePath: string) => void;
    disabled?: boolean;
}

const samples = [
    { id: 1, src: "/samples/sample1.png", label: "Large pothole" },
    { id: 2, src: "/samples/sample2.png", label: "Multiple potholes" },
    { id: 3, src: "/samples/sample3.png", label: "Wet road pothole" },
    { id: 4, src: "/samples/sample4.png", label: "Severe damage" },
];

export default function SampleImages({ onSelect, disabled }: SampleImagesProps) {
    return (
        <div>
            <p className="text-sm font-medium mb-2">Or try a sample image:</p>
            <div className="grid grid-cols-4 gap-2">
                {samples.map((sample) => (
                    <button
                        key={sample.id}
                        onClick={() => onSelect(sample.src)}
                        disabled={disabled}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent
              hover:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <Image
                            src={sample.src}
                            alt={sample.label}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 25vw, 80px"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
