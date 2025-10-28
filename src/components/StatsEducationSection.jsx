import { useState, useEffect } from "react";
import { FaGraduationCap } from "react-icons/fa";
import GlassCard from "./ui/GlassCard";
import Container from "./ui/Container";
import SectionTitle from "./ui/SectionTitle";

export default function StatsEducationSection({ data }) {
  const { stats, education } = data;
  const [githubRepos, setGithubRepos] = useState(5); // fallback count

  // GitHub API: fetch live repo count
  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const response = await fetch("https://api.github.com/users/IJNikhil");
        if (!response.ok) throw new Error("API error");
        const userData = await response.json();
        setGithubRepos(userData.public_repos || 5);
      } catch (error) {
        console.error("GitHub fetch error (rate limit?):", error);
      }
    };
    fetchGithubData();
  }, []);

  // Update stats with live data
  const updatedStats = stats.map((stat) =>
    stat.label === "GitHub Repos" ? { ...stat, value: githubRepos.toString() } : stat
  );

  if (!updatedStats?.length || !education?.length) return null;

  return (
    <section id="stats-education" className="py-10 sm:py-14 md:py-16 bg-bg scroll-mt-16">
      <Container>
        <SectionTitle>My Journey & Education</SectionTitle>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {updatedStats.map((stat, i) => (
            <div
              key={`stat-${i}`}
              className="opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards] transform transition-transform duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <GlassCard className="text-center p-5 sm:p-6 md:p-7">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent mb-2 sm:mb-3 font-serif">
                  {stat.value}
                </div>
                <div className="text-gray-200 text-base sm:text-lg font-medium">{stat.label}</div>
                <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-xs mx-auto">
                  {stat.description}
                </p>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-16 h-[2px] bg-primary/70 mx-auto mb-10 rounded-xl"></div>

        {/* Education Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {education.map((edu, i) => (
            <div
              key={`edu-${i}`}
              className="opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards] transform transition-transform duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${(updatedStats.length + i) * 0.2}s` }}
              aria-label={`Education: ${edu.degree} at ${edu.institution}`}
            >
              <GlassCard className="p-5 sm:p-6 md:p-7">
                <div className="flex items-center mb-3">
                  <FaGraduationCap className="text-primary text-lg sm:text-xl mr-2" />
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-text font-serif relative">
                    {edu.degree}
                    <span className="absolute bottom-0 left-0 w-10 h-[2px] bg-primary rounded-md"></span>
                  </h3>
                </div>
                <p className="text-accent text-sm sm:text-base font-medium">{edu.institution}</p>
                <p className="text-gray-400 text-sm sm:text-base mt-2 font-semibold">
                  Score: {edu.score}
                </p>
              </GlassCard>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
