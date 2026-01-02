import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Code, Database, Globe } from "lucide-react";

export default function StatsEducationSection({ data }) {
  const { stats, education } = data;
  const [githubRepos, setGithubRepos] = useState(5);

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

  const updatedStats = stats?.map((stat) =>
    stat.label === "GitHub Repos" ? { ...stat, value: githubRepos.toString() } : stat
  ) || [];

  if (!updatedStats.length && !education?.length) return null;

  return (
    <section id="stats-education" className="py-32 relative">
      <div className="container mx-auto px-6">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-accent font-medium tracking-wider uppercase text-sm">My Journey</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-4">
            Stats & <span className="text-gradient">Education</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Stats Grid - Using Card Style */}
          <div className="grid grid-cols-2 gap-4">
            {updatedStats.map((stat, i) => (
              <motion.div
                key={`stat-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-6 rounded-3xl bg-card border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-center items-center text-center overflow-hidden h-[200px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="text-4xl md:text-5xl font-bold font-display text-white mb-2 relative z-10">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-widest relative z-10">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Education - Using Card Style */}
          <div className="space-y-4">
            {education?.map((edu, i) => (
              <motion.div
                key={`edu-${i}`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-3xl bg-card border border-white/5 hover:border-white/10 transition-colors overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <GraduationCap className="text-accent" size={24} />
                      <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                    </div>
                    <p className="text-lg text-gray-400 mb-3">{edu.institution}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {edu.description || "Specialized in full-stack development, algorithms, and software architecture."}
                    </p>
                  </div>
                  <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-gray-300 whitespace-nowrap">
                    {edu.year}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}