import { motion } from "framer-motion";

export default function ProjectSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden bg-background-card-dark bento-border h-full min-h-[400px] relative">
            <div className="absolute inset-0 animate-pulse bg-white/5" />
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="w-20 h-6 bg-white/10 rounded-full" />
                    <div className="flex gap-2">
                        <div className="size-8 bg-white/10 rounded-lg" />
                        <div className="size-8 bg-white/10 rounded-lg" />
                    </div>
                </div>
                <div>
                    <div className="w-3/4 h-8 bg-white/10 rounded mb-3" />
                    <div className="w-full h-4 bg-white/10 rounded mb-2" />
                    <div className="w-2/3 h-4 bg-white/10 rounded" />
                </div>
            </div>
        </div>
    );
}
