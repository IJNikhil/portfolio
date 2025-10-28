// Showcase.js
import { Link } from "react-router-dom";
import GlassCard from "./ui/GlassCard";
import Button from "./ui/Button";
import Container from "./ui/Container";
import SectionTitle from "./ui/SectionTitle";
import AnimatedLink from "./ui/AnimatedLink";

export default function Showcase({ data, achievementsData }) {
  if (!data || data.length === 0) return null;

  const maxDisplayProjects = 4; // 3 project cards + 1 button slot
  const maxDisplayAchievements = 4;

  const displayProjects = data.slice(0, maxDisplayProjects - 1);
  const hasMoreProjects = data.length > maxDisplayProjects - 1;
  const displayAchievements = achievementsData ? achievementsData.slice(0, maxDisplayAchievements) : [];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-bg scroll-mt-16">
      <Container>
        <SectionTitle>Showcase</SectionTitle>

        <div
          className="relative grid grid-cols-1 gap-6 sm:grid-rows-[auto_auto] sm:grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 lg:gap-8"
          style={{ minHeight: "480px" }}
        >
          {/* Vertical divider */}
          <div className="hidden lg:block absolute top-6 bottom-6 left-1/2 w-[1px] bg-gray-700/50 z-10" />

          {/* Section 1 - Projects */}
          <div className="pr-0 sm:pr-0 lg:pr-6">
            <h3 className="text-lg sm:text-xl font-semibold text-primary mb-4">Featured Projects</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {displayProjects.map((project, i) => (
                <Link
                  key={i}
                  to={`/projects/${encodeURIComponent(project.title)}`}
                  className="opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <GlassCard className="hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6">
                    <h4 className="text-lg sm:text-xl font-semibold text-text mb-1 font-serif">{project.title}</h4>
                    <p className="text-gray-300 text-xs sm:text-sm mb-2 whitespace-normal">{project.description}</p>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </GlassCard>
                </Link>
              ))}

              {hasMoreProjects && (
                <div className="flex justify-center items-center">
                  <AnimatedLink
                    to="/projects/all"
                    className="inline-block opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]"
                    style={{ animationDelay: `${displayProjects.length * 0.2}s` }}
                  >
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full h-full min-h-[130px] rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-bg transition-colors duration-300"
                    >
                      View All Projects
                    </Button>
                  </AnimatedLink>
                </div>
              )}
            </div>
          </div>

          {/* Section 2 - Achievements */}
          <div className="pl-0 sm:pl-0 lg:pl-6">
            <h3 className="text-lg sm:text-xl font-semibold text-primary mb-4">Milestones</h3>
            {displayAchievements.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                {displayAchievements.map((achievement, i) => (
                  <div
                    key={i}
                    className="opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <GlassCard className="p-4 sm:p-6">
                      <h4 className="text-lg sm:text-xl font-semibold text-text mb-1 font-serif">{achievement.title}</h4>
                      <p className="text-gray-300 text-xs sm:text-sm mb-2 overflow-hidden text-ellipsis line-clamp-2 whitespace-normal">{achievement.description}</p>
                      {achievement.social && (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(achievement.social, "_blank")}
                          >
                            View Post
                          </Button>
                        </div>
                      )}
                    </GlassCard>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">No milestones to display</div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
