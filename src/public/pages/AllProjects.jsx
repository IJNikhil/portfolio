import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import { usePortfolio } from "../../shared/context/PortfolioContext";

const overlayVariants = {
  initial: { opacity: 0 },
  hover: { opacity: 1 },
};

export default function AllProjects() {
  const { data } = usePortfolio();
  const projects = data.projects.filter(p => p.isLive || p.isVisible);

  return (
    <section className="relative py-24 bg-bg min-h-screen text-gray-100 overflow-hidden">
      <Container className="relative z-10 pt-20">
        <div className="mb-16">
          <SectionTitle>
            All Projects
          </SectionTitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-card/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500"
            >
              <div className="aspect-video relative overflow-hidden bg-white/5">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    className="bg-white/10 backdrop-blur-md text-white border-white/20 rounded-full w-12 h-12 p-0 flex items-center justify-center hover:bg-white text-black hover:text-black"
                    onClick={() => window.location.href = `/projects/${encodeURIComponent(project.title)}`}
                  >
                    <ArrowUpRight size={20} />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold font-display mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech?.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/5">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
