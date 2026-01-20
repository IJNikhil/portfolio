import { memo } from "react";
import { motion } from "framer-motion";
import { scrollToSection } from "../../shared/utils/scrollUtils";
import { TypewriterText } from "../../shared/components/TypewriterText";
import { resolveDriveImage } from "../../shared/utils/driveHelper";

interface HeroProps {
    data: {
        firstName?: string;
        tagline?: string;
        bio?: string;
        secondaryBio?: string;
        linkedin?: string;
        github?: string;
        terminalGreeting?: string;
        terminalStack?: string[];
        avatar?: string;
    };
}

const HeroSection = memo(({ data }: HeroProps) => {
    const tagline = data?.tagline;
    const bio = data?.bio;
    const secondaryBio = data?.secondaryBio;

    // If no data is available yet (or empty), we can show a loader or nothing.
    // Given the context handles initial loading, we assume data exists but might be empty strings.
    if (!data?.tagline && !data?.bio) return null;

    return (
        <section className="max-w-[1200px] mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center min-h-[85vh]">
            {/* Text Content */}
            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-white"
                >
                    {tagline}
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-slate-400 max-w-lg leading-relaxed font-sans"
                >
                    {bio} {secondaryBio}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-4 pt-4"
                >
                    <button
                        onClick={() => scrollToSection("showcase")}
                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform"
                    >
                        Explore Works
                    </button>
                    <div className="flex gap-2">
                        <a href={data?.github} target="_blank" rel="noreferrer" className="size-14 rounded-xl border border-primary/20 flex items-center justify-center hover:bg-primary/10 transition-colors text-white">
                            <span className="material-symbols-outlined text-2xl">code</span>
                        </a>
                        <a href={data?.linkedin} target="_blank" rel="noreferrer" className="size-14 rounded-xl border border-primary/20 flex items-center justify-center hover:bg-primary/10 transition-colors text-white">
                            <span className="material-symbols-outlined text-2xl">alternate_email</span>
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Right Column: Avatar & Terminal */}
            <div className="relative flex flex-col items-center justify-center">
                {/* Avatar (if exists) */}
                {data?.avatar && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8 relative z-10"
                    >
                        <div className="size-40 md:size-48 rounded-full p-1 bg-gradient-to-br from-primary via-accent-teal to-purple-600">
                            import {resolveDriveImage} from "../../shared/utils/driveHelper";

                            // ... inside the component ...
                            <img
                                src={resolveDriveImage(data.avatar)}
                                alt="Profile"
                                loading="lazy"
                                decoding="async"
                                className="size-full rounded-full object-cover border-4 border-[#0d0d12]"
                            />
                        </div>
                        {/* Status Dot */}
                        <div className="absolute bottom-2 right-4 size-6 bg-[#27c93f] rounded-full border-4 border-[#0d0d12]" title="Available for work"></div>
                    </motion.div>
                )}

                {/* Terminal Style Bio Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative w-full"
                >
                    <div className="w-full bg-[#0d0d12] rounded-xl overflow-hidden border border-white/10 terminal-glow font-mono text-sm shadow-2xl">
                        {/* Terminal Header */}
                        <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10">
                            <div className="flex gap-2">
                                <div className="size-3 rounded-full bg-[#ff5f56]"></div>
                                <div className="size-3 rounded-full bg-[#ffbd2e]"></div>
                                <div className="size-3 rounded-full bg-[#27c93f]"></div>
                            </div>
                            <div className="text-white/40 text-[11px]">bash — profile</div>
                            <div className="size-3"></div>
                        </div>

                        {/* Terminal Body */}
                        <div className="p-6 space-y-3 text-white/80 leading-relaxed">
                            {data?.terminalGreeting && (
                                <>
                                    <p>
                                        <span className="text-accent-teal">➜</span> <span className="text-primary">~</span> <TypewriterText text="whoami" speed={80} delay={500} />
                                    </p>
                                    <p className="text-white/60 mb-4 min-h-[1.5em]">
                                        <TypewriterText text={data.terminalGreeting} speed={50} delay={1500} />
                                    </p>
                                </>
                            )}

                            {Array.isArray(data?.terminalStack) && data.terminalStack.length > 0 && (
                                <>
                                    <p>
                                        <span className="text-accent-teal">➜</span> <span className="text-primary">~</span> <TypewriterText text="locate --current-stack" speed={80} delay={4000} />
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-white/50 pt-2">
                                        {data.terminalStack.map((tech, index) => (
                                            <div key={tech} className="flex items-center gap-2">
                                                <span className="text-primary">●</span>
                                                <TypewriterText text={tech} speed={50} delay={5500 + (index * 200)} cursor={false} />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <p className="pt-4"><span className="text-accent-teal">➜</span> <span className="text-primary">~</span> <span className="animate-pulse">_</span></p>
                        </div>
                    </div>
                </motion.div>

                {/* Abstract floating element (Background) */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 bg-primary/20 blur-[100px] rounded-full"></div>
            </div>
        </section>
    );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
