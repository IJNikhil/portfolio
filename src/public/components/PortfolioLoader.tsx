import React from "react";
import { usePortfolio } from "../../shared/context/PortfolioContext";

import { useLocation } from "react-router-dom";

export default function PortfolioLoader({ children }: { children: React.ReactNode }) {
    const { isLoading } = usePortfolio();
    const location = useLocation();
    const isAdmin = location.pathname.startsWith("/admin");

    if (isAdmin) return <>{children}</>;

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-white/50 font-mono text-sm animate-pulse">Initializing System...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
