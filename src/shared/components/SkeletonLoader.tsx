export default function SkeletonLoader({ type = "card" }: { type?: "card" | "list" | "text" }) {
    if (type === "card") {
        return (
            <div className="bg-surface-dark rounded-lg p-6 animate-pulse">
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

    if (type === "list") {
        return (
            <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
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

    // text type
    return (
        <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
        </div>
    );
}
