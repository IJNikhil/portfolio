export default function SkeletonLoader({ variant = "card", ...props }: { variant?: "card" | "list" | "text", count?: number, lines?: number, className?: string }) {
    if (variant === "card") {
        return (
            <div className={`bg-surface-dark rounded-lg p-6 animate-pulse ${props.className || ''}`}>
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
                <div className="flex gap-2">
                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                </div>
            </div>
        );
    }

    if (variant === "list") {
        // Use count prop if provided, default to 3
        const items = Array.from({ length: props.count || 3 });
        return (
            <div className={`space-y-3 animate-pulse ${props.className || ''}`}>
                {items.map((_, i) => (
                    <div key={i} className="flex items-center gap-4 bg-surface-dark p-4 rounded-lg">
                        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // text variant
    const textLines = Array.from({ length: props.lines || 3 });
    return (
        <div className={`space-y-2 animate-pulse ${props.className || ''}`}>
            {textLines.map((_, i) => (
                <div key={i} className={`h-4 bg-gray-700 rounded ${i === textLines.length - 1 ? 'w-4/6' : 'w-full'}`}></div>
            ))}
        </div>
    );
}
