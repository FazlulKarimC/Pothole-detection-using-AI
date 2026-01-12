"use client";

interface Detection {
    id: number;
    class: string;
    confidence: number;
    box: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
}

interface ResultsPanelProps {
    count: number;
    severity: number;
    latencyMs: number;
    detections: Detection[];
    isLoading?: boolean;
}

export default function ResultsPanel({
    count,
    severity,
    latencyMs,
    detections,
    isLoading
}: ResultsPanelProps) {
    const avgConfidence = detections.length > 0
        ? detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length
        : 0;

    const getSeverityColor = (sev: number) => {
        if (sev === 0) return "bg-gray-400";
        if (sev < 2) return "bg-green-500";
        if (sev < 5) return "bg-yellow-500";
        if (sev < 8) return "bg-orange-500";
        return "bg-red-500";
    };

    const getSeverityLabel = (sev: number) => {
        if (sev === 0) return "No potholes";
        if (sev < 2) return "Low";
        if (sev < 5) return "Moderate";
        if (sev < 8) return "High";
        return "Critical";
    };

    if (isLoading) {
        return (
            <div className="p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-muted">Analyzing image...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
                {/* Count */}
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                    <p className="text-2xl font-bold text-blue-600">{count}</p>
                    <p className="text-xs text-muted mt-1">Potholes</p>
                </div>

                {/* Confidence */}
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                    <p className="text-2xl font-bold">{(avgConfidence * 100).toFixed(0)}%</p>
                    <p className="text-xs text-muted mt-1">Avg Confidence</p>
                </div>

                {/* Latency */}
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                    <p className="text-2xl font-bold">{latencyMs.toFixed(0)}</p>
                    <p className="text-xs text-muted mt-1">ms Latency</p>
                </div>
            </div>

            {/* Severity meter */}
            <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Severity Score</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getSeverityColor(severity)}`}>
                        {getSeverityLabel(severity)}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                    <div
                        className="h-full severity-meter rounded-full transition-all duration-500"
                        style={{ width: `${(severity / 10) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-muted mt-1">
                    <span>0</span>
                    <span>{severity.toFixed(1)}/10</span>
                    <span>10</span>
                </div>
            </div>

            {/* Detection list */}
            {detections.length > 0 && (
                <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="text-sm font-medium mb-2">Detections</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                        {detections.map((d) => (
                            <div key={d.id} className="flex items-center justify-between text-xs py-1">
                                <span className="text-muted">Pothole #{d.id}</span>
                                <span className="font-mono">{(d.confidence * 100).toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
