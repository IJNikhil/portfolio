import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import portfolioData from "../data/portfolioData.json";

const overlayVariants = {
  initial: { opacity: 0 },
  hover: { opacity: 1 },
};

export default function AllProjects() {
  const { projects } = portfolioData;

  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-b from-[#0b0b0c] via-[#101012] to-[#0b0b0c] min-h-screen text-gray-100 overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        <div className="absolute top-1/4 left-1/5 w-60 h-60 bg-[var(--accent)]/20 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-52 h-52 bg-[var(--accent-secondary)]/20 blur-2xl" />
        <div className="absolute bottom-8 left-4 w-28 h-28 bg-indigo-600/25 blur-xl" />
      </div>
      <Container className="relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <SectionTitle>
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] bg-clip-text text-transparent drop-shadow-md">
              All Projects
            </span>
          </SectionTitle>
          <p className="text-gray-300 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            Explore my work—touch or tap to discover more about each project and its unique journey.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <Link
                to={`/projects/${encodeURIComponent(project.title)}`}
                className="group block h-full"
                tabIndex={0}
                aria-label={`View details for ${project.title}`}
              >
                <GlassCard className="relative rounded-2xl overflow-hidden shadow-lg border border-[var(--accent)]/20 hover:shadow-[0_4px_24px_var(--accent)/18] transition-all duration-300 h-full flex flex-col">
                  {/* Project Image for mobile & desktop */}
                  {project.image && (
                    <div className="relative h-36 sm:h-40 md:h-48 rounded-t-2xl overflow-hidden">
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 group-hover:brightness-90 transition-all duration-400"
                        loading="lazy"
                        whileHover={{ scale: 1.04, filter: "brightness(0.93)" }}
                        whileTap={{ scale: 0.99 }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent to-black/45 pointer-events-none"
                        variants={overlayVariants}
                        initial="initial"
                        whileHover="hover"
                        transition={{ duration: 0.25 }}
                      />
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-4 sm:space-y-5">
                    <h3 className="text-lg md:text-2xl font-semibold font-serif text-white group-hover:text-[var(--accent)] transition-colors duration-200 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed min-h-[40px] mb-0 line-clamp-3">
                      {project.description}
                    </p>
                    {project.tech && project.tech.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.tech.map((tech, t) => (
                          <span
                            key={t}
                            className="inline-block px-2 py-0.5 text-[10px] sm:text-xs font-semibold tracking-wide rounded bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] border border-[var(--accent-secondary)]/40"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[var(--accent)] text-[var(--accent)] rounded-md px-4 py-2 transition-all duration-300 hover:bg-[var(--accent)] hover:text-[var(--bg)] shadow-sm text-sm sm:text-base"
                      >
                        View Details →
                      </Button>
                      <div className="flex gap-2 pt-1">
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[var(--accent-secondary)] hover:underline text-xs font-medium"
                          >
                            Live Demo
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-gray-400 hover:text-white text-lg"
                          >
                            <span className="sr-only">GitHub</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0.3c-6.6 0-12 5.6-12 12.5c0 5.5 3.7 10.2 8.9 11.8c0.7 0.1 0.9-0.3 0.9-0.6v-2.2c-3.6 0.8-4.3-1.7-4.3-1.7c-0.6-1.5-1.4-1.9-1.4-1.9c-1.2-0.8 0.1-0.7 0.1-0.7c1.3 0.1 2 1.3 2 1.3c1.1 2 2.9 1.4 3.7 1c0.1-0.8 0.4-1.4 0.7-1.8c-2.9-0.3-5.9-1.5-5.9-6.5c0-1.4 0.5-2.5 1.3-3.4c-0.1-0.3-0.6-1.5 0.1-3.1c0 0 1.1-0.4 3.5 1.3c1-0.3 2-0.5 3-0.5c1 0 2 0.2 3 0.5c2.3-1.7 3.5-1.3 3.5-1.3c0.7 1.6 0.2 2.8 0.1 3.1c0.8 0.9 1.3 2 1.3 3.4c0 5-3 6.1-5.9 6.5c0.4 0.4 0.8 1.1 0.8 2.2v3.2c0 0.3 0.2 0.7 0.9 0.6c5.3-1.7 8.9-6.3 8.9-11.8c0-6.9-5.4-12.5-12-12.5z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
