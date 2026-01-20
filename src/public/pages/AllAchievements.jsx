import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import { usePortfolio } from "../../shared/context/PortfolioContext";

export default function AllAchievements() {
  const { data } = usePortfolio();
  const achievements = data.achievements.filter(a => a.isVisible);

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-bg min-h-screen">
      <Container>
        <SectionTitle>All Achievements</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {achievements.map((achievement, i) => (
            <div
              key={i}
              className="opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <GlassCard className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-text mb-2 sm:mb-3 font-serif">{achievement.title}</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-3">{achievement.description}</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {achievement.link && (
                    <Button variant="ghost" onClick={() => window.open(achievement.link, "_blank")}>
                      View Certificate
                    </Button>
                  )}
                  {achievement.social && (
                    <Button variant="ghost" onClick={() => window.open(achievement.social, "_blank")}>
                      View Post
                    </Button>
                  )}
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}