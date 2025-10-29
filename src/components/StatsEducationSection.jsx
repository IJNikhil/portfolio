import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";
import GlassCard from "./ui/GlassCard";
import Container from "./ui/Container";
import SectionTitle from "./ui/SectionTitle";


export default function StatsEducationSection({ data }) {
  const { stats, education } = data;
  const [githubRepos, setGithubRepos] = useState(5);


  // Fetch GitHub public repo count dynamically
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


  const updatedStats =
    stats?.map((stat) =>
      stat.label === "GitHub Repos"
        ? { ...stat, value: githubRepos.toString() }
        : stat
    ) || [];


  if (!updatedStats.length && !education?.length) return null;


  return (
    <section
      id="stats-education"
      // Generous vertical padding for desktop view
      className="relative pt-28 sm:pt-36 pb-24 bg-gradient-to-b from-bg via-card to-bg 
                 text-gray-100 scroll-mt-20 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-80">
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-accent/10 blur-[150px] rounded-full animate-subtle-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-accent-secondary/10 blur-[130px] rounded-full animate-subtle-pulse delay-1000" />
      </div>


      <Container className="relative z-10">
        {/* Section Title - Max width applied to center correctly */}
        <div className="text-center mb-4 sm:mb-8 max-w-2xl mx-auto">
          <SectionTitle>
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              My Journey & Education
            </span>
          </SectionTitle>
        </div>


        {/* Stats Grid - Max width applied for central alignment on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-16 mb-12 max-w-5xl mx-auto">
          {updatedStats.map((stat, i) => (
            <motion.div
              key={`stat-${i}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <GlassCard
                className="text-center p-6 sm:p-7 bg-card/70 border border-gray-700/30 
                           hover:shadow-[0_0_28px_var(--accent)/30] rounded-2xl transition-shadow duration-300"
              >
                <div className="text-4xl sm:text-5xl font-bold text-accent mb-1 font-serif drop-shadow-[0_0_8px_var(--accent)/30]">
                  {stat.value}
                </div>
                <div className="text-base sm:text-lg font-semibold text-gray-200 tracking-wide">
                  {stat.label}
                </div>
                {stat.description && (
                  <p className="text-gray-400 text-xs sm:text-sm mt-2 leading-relaxed max-w-xs mx-auto">
                    {stat.description}
                  </p>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>


        {/* Stylish Divider - Adjusted width for desktop balance */}
        <div className="flex justify-center mb-10">
          <div
            // 💥 DESKTOP OPTIMIZATION: Divider now scales up to w-1/3 of the container width on large screens
            className="w-1/3 md:w-1/3 h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0 
                       rounded-full opacity-80 shadow-[0_0_25px_var(--accent-secondary)/40] animate-pulse-slow"
            aria-hidden="true"
          />
        </div>


        {/* Education Timeline Title */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-12 text-center font-serif flex items-center justify-center gap-3">
          <FaGraduationCap className="text-accent text-2xl sm:text-3xl" aria-hidden="true" />
          Academic History
        </h2>


        {/* Education Grid - Max width applied for central alignment on large screens */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education?.map((edu, i) => (
              <motion.div
                key={`edu-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <GlassCard
                  className="p-6 sm:p-7 border-b-2 border-accent-secondary/50 
                             hover:-translate-y-1 hover:shadow-[0_0_20px_var(--accent-secondary)/25] 
                             rounded-xl transition-transform duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-accent text-lg sm:text-xl font-semibold font-serif">
                      {edu.degree}
                    </h3>
                    <time className="text-sm font-medium text-gray-400 px-3 py-1 rounded-full border border-gray-700/50 select-none">
                      {edu.year}
                    </time>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed tracking-wide">
                    {edu.institution}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}