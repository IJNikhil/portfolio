import { usePortfolio } from "../../shared/context/PortfolioContext";
import { useGitHubStats } from "../../shared/hooks/useGitHubStats";
import HeroSection from "../components/HeroSection";
import Showcase from "../components/Showcase";
import SkillsSection from "../components/SkillsSection";
import ContactSocialSection from "../components/ContactSocialSection";

import { Github } from "lucide-react";

const LandingPage = () => {
    // Consume Data from Context (Dynamic)
    const { hero, projects, achievements, skills, settings, isLoading } = usePortfolio();

    // Safety check just in case hero is not loaded yet
    const contact = {}; // Contact data is now handled via direct settings or hardcoded components, or needs to be pulled if it was in 'data'. Checking Context... 'contact' is NOT in PortfolioState interface anymore. It seems to have been removed or merged into settings/hero. In previous context it was removed.  Wait, the USER's legacy backend has 'Contact' sheet, but newer model might have dropped it.
    // The previous error was "Cannot destructure property 'hero' of 'data'". By destructuring directly we fix that.

    // However, looking at the code below, it uses `contact`.
    // I need to provide `contact` or remove it.
    // In strict models.ts, there is no `contact` object.
    // It seems `contact` was used for ContactSocialSection.
    // Let's assume for now settings has contact info or use Hero.
    // Actually, `ContactSocialSection` takes `contactData`.
    // Let's see if we can derive it or if we should just pass Hero which has email/socials.

    // TEMPORARY FIX: Map Hero to Contact-like structure to avoid breaking downstream or valid props.
    const contactData = {
        email: hero?.email,
        github: hero?.socials?.github,
        linkedin: hero?.socials?.linkedin,
        intro: hero?.bio // approximate
    };

    // Extract GitHub username from URL (Robust Regex)
    const getGitHubUsername = (url: string) => {
        if (!url) return "";
        // Match github.com/USERNAME
        const match = url.match(/github\.com\/([^\/]+)/);
        if (match && match[1]) return match[1];
        // Handles "IJNikhil" or "@IJNikhil"
        if (!url.includes("/")) return url.replace("@", "");
        // Fallback: Last segment
        return url.split("/").filter(Boolean).pop() || "";
    };

    const githubUsername = getGitHubUsername(hero.github);
    const { repos, topRepos, loading: ghLoading } = useGitHubStats(githubUsername || "");

    return (
        <div className="bg-background-dark min-h-screen">
            {/* Hero Section */}
            <section id="hero">
                <HeroSection data={hero} />
            </section>

            <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-20 pb-24 w-full">

                {/* Open Source Activity - Bento Grid Redesign (Temporarily Disabled) */}
                {false && githubUsername && (
                    <section id="github-stats" className="scroll-mt-32 space-y-8">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-8">Open Source Activity</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1: Profile Summary (Left) */}
                            <div className="md:col-span-1 p-8 rounded-2xl bg-background-card-dark bento-border flex flex-col justify-between group relative overflow-hidden">
                                <div className="z-10 relative space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="size-16 rounded-full p-1 bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                                            <img
                                                src={`https://github.com/${githubUsername}.png`}
                                                alt={githubUsername}
                                                className="size-full rounded-full"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">@{githubUsername}</h3>
                                            <a
                                                href={`https://github.com/${githubUsername}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary text-xs hover:underline flex items-center gap-1"
                                            >
                                                View Profile <span className="material-symbols-outlined text-[10px]">arrow_outward</span>
                                            </a>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div>
                                            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Public Repos</div>
                                            <div className="text-3xl font-bold text-white tracking-tight">
                                                {ghLoading ? "..." : repos}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Abstract Decorator */}
                                <div className="absolute -right-12 -bottom-12 p-8 opacity-5 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                                    <Github className="w-48 h-48 text-white" />
                                </div>
                            </div>

                            {/* Card 2: Top Repositories (Right) */}
                            <div className="md:col-span-2 p-8 rounded-2xl bg-background-card-dark bento-border flex flex-col relative overflow-hidden h-full">
                                <div className="flex justify-between items-center mb-6 z-10 relative">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">terminal</span>
                                        <h3 className="font-bold text-white">Top Repositories</h3>
                                    </div>
                                    <a
                                        href={`https://github.com/${githubUsername}?tab=repositories`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        View All <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                                    </a>
                                </div>

                                <div className="flex-1 w-full relative z-10 flex flex-col gap-3">
                                    {ghLoading ? (
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-20 bg-[#1f1f23] rounded-lg animate-pulse"></div>
                                            ))}
                                        </div>
                                    ) : (
                                        topRepos?.map((repo: any) => (
                                            <a
                                                key={repo.name}
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group block p-4 rounded-lg bg-[#1f1f23] border border-[#30363d] hover:border-[#39ff14] transition-all duration-300 relative overflow-hidden"
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-white group-hover:text-[#39ff14] transition-colors truncate pr-4">
                                                        {repo.name}
                                                    </h4>
                                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px] text-yellow-400">star</span>
                                                            {repo.stargazers_count}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px]">fork_right</span>
                                                            {repo.forks_count}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-slate-400 text-xs line-clamp-1 mb-2">
                                                    {repo.description || "No description available."}
                                                </p>

                                                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                                                    <span className={`w-2 h-2 rounded-full ${repo.language === 'TypeScript' ? 'bg-[#3178c6]' : repo.language === 'JavaScript' ? 'bg-[#f7df1e]' : 'bg-primary'}`}></span>
                                                    {repo.language || "Code"}
                                                </div>

                                                {/* Hover Glow */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#39ff14]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                            </a>
                                        ))
                                    )}
                                </div>

                                {/* Subtle Background Gradient */}
                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Showcase / Projects */}
                {settings?.showProjects && (
                    <section id="projects" className="scroll-mt-32">
                        {/* Filter Hidden & Sort Featured First */}
                        <Showcase
                            data={projects
                                .filter(p => p.isVisible)
                                .sort((a, b) => (Number(b.isFeatured) - Number(a.isFeatured)))
                            }
                            loading={isLoading}
                        />
                    </section>
                )}

                {/* Achievements */}
                {settings?.showAchievements && achievements && achievements.length > 0 && (
                    <section id="achievements" className="scroll-mt-32 space-y-8">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-8">Achievements & Certifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {achievements.map((ach: any, i: number) => (
                                <div key={i} className="p-6 rounded-2xl bg-background-card-dark bento-border relative overflow-hidden group hover:border-primary/50 transition-colors">
                                    <h3 className="text-xl font-bold text-white mb-2">{ach.title}</h3>
                                    <p className="text-slate-400 text-sm mb-4">{ach.description}</p>
                                    <span className="text-primary text-xs font-mono font-bold uppercase tracking-widest">{ach.date || "2024"}</span>
                                    <div className="absolute -right-6 -bottom-6 size-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors"></div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills Section */}
                {settings?.showSkills && skills && skills.length > 0 && (
                    <section id="skills" className="scroll-mt-32">
                        <SkillsSection data={skills} />
                    </section>
                )}

                {/* Contact Section */}
                {settings?.showContact && contactData && (
                    <section id="contact" className="scroll-mt-32">
                        <ContactSocialSection contactData={contactData} />
                    </section>
                )}
            </div>
        </div>
    )
}

export default LandingPage;
