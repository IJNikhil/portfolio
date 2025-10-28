import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";
import GlassCard from "./ui/GlassCard";
import Container from "./ui/Container";
import SectionTitle from "./ui/SectionTitle";

export default function StatsEducationSection({ data }) {
  const { stats, education } = data;
  const [githubRepos, setGithubRepos] = useState(5);

  // Fetch GitHub repo count dynamically
  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const response = await fetch("https://api.github.com/users/IJNikhil");
        if (!response.ok) throw new Error("API error");
        const userData = await response.json();
        setGithubRepos(userData.public_repos || 5);
      } catch (error) {
        console.error("GitHub fetch error:", error);
      }
    };
    fetchGithubData();
  }, []);

  const updatedStats = stats.map((stat) =>
    stat.label === "GitHub Repos"
      ? { ...stat, value: githubRepos.toString() }
      : stat
  );

  if (!updatedStats?.length || !education?.length) return null;

  return (
    <section
      id="stats-education"
      className="relative py-20 sm:py-24 bg-gradient-to-b from-[#0b0b0c] via-[#101012] to-[#0b0b0c] 
                 text-gray-100 scroll-mt-16 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[320px] h-[320px] bg-[var(--accent)]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[260px] h-[260px] bg-[var(--accent-secondary)]/10 blur-[100px] rounded-full"></div>
      </div>

      <Container className="relative z-10">
        <div className="text-center mb-2">
          <SectionTitle>
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              My Journey & Education
            </span>
          </SectionTitle>
        </div>

        {/* ---------- Stats Section ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 mb-16">
          {updatedStats.map((stat, i) => (
            <motion.div
              key={`stat-${i}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <GlassCard
                className="text-center p-6 sm:p-7 bg-[#16161a]/70 border border-gray-700/30 
                           rounded-2xl backdrop-blur-md hover:-translate-y-1 
                           hover:shadow-[0_0_25px_var(--accent)/25] transition-all duration-300"
              >
                <div className="text-3xl sm:text-4xl font-bold text-[var(--accent)] mb-1 font-serif drop-shadow-[0_0_6px_var(--accent)/25]">
                  {stat.value}
                </div>
                <div className="text-base sm:text-lg font-semibold text-gray-200 tracking-wide">
                  {stat.label}
                </div>
                {stat.description && (
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed max-w-xs mx-auto">
                    {stat.description}
                  </p>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* ---------- Stylish Divider ---------- */}
        <div className="relative flex justify-center mb-12">
          <div
            className="w-32 h-[3px] bg-gradient-to-r from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent)] 
                       rounded-full opacity-80 shadow-[0_0_20px_var(--accent-secondary)/40] animate-pulse-slow"
          ></div>
        </div>

        {/* ---------- Education Timeline ---------- */}
        <div className="relative pl-8 sm:pl-12 space-y-8">
          {/* Glowing vertical timeline line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-[3px] 
                       bg-gradient-to-b from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent)] 
                       rounded-full opacity-70 shadow-[0_0_20px_var(--accent)/30]"
          ></div>

          {education.map((edu, i) => (
            <motion.div
              key={`edu-${i}`}
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >

              <GlassCard
                className="p-6 sm:p-7 bg-[#16161a]/70 border border-gray-700/30 rounded-2xl 
                           backdrop-blur-md hover:-translate-y-1 hover:shadow-[0_0_30px_var(--accent-secondary)/25] 
                           transition-all duration-300"
              >
                <div className="flex items-center mb-3">
                  <FaGraduationCap className="text-[var(--accent)] text-xl sm:text-2xl mr-3" />
                  <h3 className="text-[var(--accent)] text-base sm:text-lg md:text-xl font-semibold font-serif relative">
                    {edu.degree}
                    <span className="absolute bottom-0 left-0 w-8 h-[1.5px] bg-[var(--accent)] rounded-md"></span>
                  </h3>
                </div>
                <p className="text-gray-300 text-sm sm:text-base tracking-wide leading-relaxed">
                  {edu.institution}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
