import React, { useState } from "react";
import { scrollToSection } from "../../shared/utils/scrollUtils";
import { usePortfolio } from "../../shared/context/PortfolioContext";

interface PublicShellProps {
    children: React.ReactNode;
}

export default function PublicShell({ children }: PublicShellProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { hero } = usePortfolio();

    const handleNavClick = (id: string) => {
        scrollToSection(id);
        setIsMobileMenuOpen(false);
    };

    // Safety check if hero data hasn't loaded (though loader should catch this)
    if (!hero) return null;

    // Helper to safely get resume link 
    const resumeLink = hero.resumeUrl || "#"; // Corrected property name from resumeLink to resumeUrl based on models.ts if needed, checking context... models says resumeUrl. 
    // Wait, let's stick to what was likely intended or safe. The error was reading 'hero'.
    // Let's use optional chaining just in case.

    // Reconstruct social links from Hero data
    const socialLinks = [
        { label: "GitHub", url: hero.socials?.github || "#" },
        { label: "LinkedIn", url: hero.socials?.linkedin || "#" },
        // Add dynamic custom links if any
        // ...(hero.customLinks || []).map(l => ({ label: l.platform, url: l.url })) 
        // Removing customLinks map for now as it might not match strict boolean
    ].filter(l => l.url && l.url !== "#");

    return (
        <div className="bg-background-dark font-sans text-white min-h-screen flex flex-col font-display selection:bg-primary/30 selection:text-white">
            {/* Top Navigation - Strict Reference Match */}
            <nav className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">terminal</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">dev_folio<span className="text-primary">.</span></span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <button onClick={() => handleNavClick("projects")} className="text-slate-400 hover:text-primary transition-colors">Projects</button>
                        <button onClick={() => handleNavClick("achievements")} className="text-slate-400 hover:text-primary transition-colors">Achievements</button>
                        <button onClick={() => handleNavClick("skills")} className="text-slate-400 hover:text-primary transition-colors">Skills</button>
                        <button onClick={() => handleNavClick("contact")} className="text-slate-400 hover:text-primary transition-colors">Contact</button>
                    </div>

                    {/* Actions & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-[12px] font-mono text-accent-teal uppercase tracking-widest">
                            <span className="size-2 rounded-full bg-accent-teal animate-pulse"></span>
                            System Online
                        </div>
                        <a
                            href={resumeLink}
                            target="_blank"
                            rel="noreferrer"
                            className="hidden sm:flex bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all items-center gap-2 shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined text-sm">download</span>
                            Resume
                        </a>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
                        >
                            <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-background-dark border-b border-primary/20 p-6 flex flex-col gap-4 shadow-2xl">
                        <button onClick={() => handleNavClick("projects")} className="text-left text-slate-300 hover:text-primary transition-colors py-2 border-b border-white/5">Projects</button>
                        <button onClick={() => handleNavClick("achievements")} className="text-left text-slate-300 hover:text-primary transition-colors py-2 border-b border-white/5">Achievements</button>
                        <button onClick={() => handleNavClick("skills")} className="text-left text-slate-300 hover:text-primary transition-colors py-2 border-b border-white/5">Skills</button>
                        <button onClick={() => handleNavClick("contact")} className="text-left text-slate-300 hover:text-primary transition-colors py-2 border-b border-white/5">Contact</button>
                        <a href={resumeLink} target="_blank" rel="noreferrer" className="mt-2 bg-primary text-white text-center py-3 rounded-lg font-bold">Download Resume</a>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1 w-full">
                {children}
            </main>

            {/* Footer - Strict Reference Match */}
            <footer className="max-w-[1200px] mx-auto px-6 py-12 border-t border-primary/10 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        {socialLinks.map((link, i) => (
                            <a key={i} href={link.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-primary transition-colors">
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <p className="text-sm text-slate-500 font-mono">
                        © 2024 Built with <span className="text-primary font-bold">integrity.sh</span>
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
                        <span className="text-accent-teal">●</span> Latency: 24ms <span className="px-2">|</span> <span className="text-accent-teal">●</span> Load: 0.12
                    </div>
                </div>
            </footer>
        </div>
    );
}
