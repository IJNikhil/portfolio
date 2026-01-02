import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

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
    <section id="stats-education" className="relative py-32 bg-bg text-gray-100 scroll-mt-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-y border-white/10 py-12">
          {updatedStats.map((stat, i) => (
            <motion.div
              key={`stat-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold font-display text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Education Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <GraduationCap size={24} />
            </div>
            <h2 className="text-3xl font-display font-bold text-white">Education</h2>
          </div>

          <div className="space-y-12 border-l border-white/10 pl-8 md:pl-12 relative">
            {education?.map((edu, i) => (
              <motion.div
                key={`edu-${i}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-[45px] md:-left-[61px] top-2 w-6 h-6 rounded-full bg-accent/20 border-2 border-accent" />

                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                  <span className="text-sm font-mono text-accent/80">{edu.year}</span>
                </div>
                <p className="text-lg text-gray-400 mb-2">{edu.institution}</p>
                <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                  {edu.description || "Focused on core computer science principles, software engineering, and full-stack development methodologies."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}