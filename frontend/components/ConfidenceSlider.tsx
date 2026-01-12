"use client";

interface ConfidenceSliderProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export default function ConfidenceSlider({ value, onChange, disabled }: ConfidenceSliderProps) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-sm">Confidence Threshold</label>
                <span className="text-sm font-mono bg-card px-2 py-0.5 rounded border border-border">
                    {value.toFixed(2)}
                </span>
            </div>

            <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                disabled={disabled}
                className="w-full h-2 rounded-lg appearance-none bg-gray-200 cursor-pointer
          accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <div className="flex justify-between text-xs text-muted mt-2">
                <span>0.1</span>
                <span>0.5</span>
                <span>0.9</span>
            </div>

            {/* Precision-Recall explanation */}
            <div className="mt-3 p-3 rounded-lg bg-card border border-border text-xs">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <span className="font-medium text-green-600">← Lower threshold</span>
                        <p className="text-muted mt-0.5">Higher recall: catches more potholes but may include false alarms</p>
                    </div>
                    <div className="flex-1 text-right">
                        <span className="font-medium text-blue-600">Higher threshold →</span>
                        <p className="text-muted mt-0.5">Higher precision: fewer false alarms but may miss some</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
