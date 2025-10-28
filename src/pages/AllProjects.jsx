import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import portfolioData from "../data/portfolioData.json";

export default function AllProjects() {
  const { projects } = portfolioData;

  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-b from-[#0b0b0c] via-[#101012] to-[#0b0b0c] min-h-screen text-gray-100 overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-[300px] h-[300px] bg-[var(--accent)]/10 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] bg-[var(--accent-secondary)]/10 blur-[100px]" />
      </div>

      <Container className="relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12">
          <SectionTitle>
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              All Projects
            </span>
          </SectionTitle>
          <p className="text-gray-400 mt-3 text-sm sm:text-base max-w-2xl mx-auto">
            Explore all my projects — from experiments to polished releases. Each one reflects my growth as a developer.
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/projects/${encodeURIComponent(project.title)}`}
                className="group block"
              >
                <GlassCard
                  className="p-6 sm:p-8 border border-gray-700/40 rounded-2xl 
                             bg-[#16161a]/70 backdrop-blur-md transition-all duration-300 
                             hover:border-[var(--accent)]/50 hover:shadow-[0_0_35px_var(--accent)/15] 
                             hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    <h3
                      className="text-xl sm:text-2xl font-semibold font-serif text-white 
                                 group-hover:text-[var(--accent)] transition-colors duration-300"
                    >
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    <div className="pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[var(--accent)] text-[var(--accent)] 
                                   rounded-lg px-5 py-2 transition-all duration-300
                                   hover:bg-[var(--accent)] hover:text-[var(--bg)]
                                   hover:shadow-[0_0_20px_var(--accent)/40]"
                      >
                        View Details →
                      </Button>
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
