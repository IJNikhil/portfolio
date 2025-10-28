import { Link } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import portfolioData from "../data/portfolioData.json";

export default function AllProjects() {
  const { projects } = portfolioData;

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-bg min-h-screen">
      <Container>
        <SectionTitle>All Projects</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {projects.map((project, i) => (
            <Link
              key={i}
              to={`/projects/${encodeURIComponent(project.title)}`}
              className="opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <GlassCard className="hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-text mb-2 sm:mb-3 font-serif">{project.title}</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">{project.description}</p>
                <Button variant="ghost">View Details</Button>
              </GlassCard>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}