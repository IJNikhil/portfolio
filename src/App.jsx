import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import StatsEducationSection from "./components/StatsEducationSection";
import Showcase from "./components/Showcase";
import SkillsSection from "./components/SkillsSection";
import ContactSocialSection from "./components/ContactSocialSection";
import ProjectDetail from "./components/ProjectDetail";
import AllProjects from "./pages/AllProjects";
import AllAchievements from "./pages/AllAchievements";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import portfolioData from "./data/portfolioData.json";

function ScrollToTopRoute() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { hero, stats, education, projects, achievements, skills, socialLinks, contact } = portfolioData;

  return (
    <div className="bg-bg text-text min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
      {/* Global Noise Texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50 mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
      </div>

      <ScrollToTopRoute />
      <Navigation />

      <main className="relative z-10 flex flex-col gap-24 pb-24">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection data={hero} />

                <div className="container mx-auto px-6 flex flex-col gap-32">
                  <section id="stats-education" className="scroll-mt-32">
                    <StatsEducationSection data={{ stats, education }} />
                  </section>

                  <section id="showcase" className="scroll-mt-32">
                    <Showcase data={projects} achievementsData={achievements} />
                  </section>

                  <section id="skills" className="scroll-mt-32">
                    <SkillsSection data={skills} />
                  </section>

                  <section id="contact" className="scroll-mt-32">
                    <ContactSocialSection contactData={contact} socialData={socialLinks} />
                  </section>
                </div>
              </>
            }
          />
          <Route path="/projects/all" element={<AllProjects />} />
          <Route path="/projects/:id" element={<ProjectDetail projects={projects} />} />
          <Route path="/achievements/all" element={<AllAchievements />} />
        </Routes>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}