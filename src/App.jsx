import { Routes, Route } from "react-router-dom";
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
import Divider from "./components/ui/Divider";
import portfolioData from "./data/portfolioData.json";

export default function App() {
  const { hero, stats, education, projects, achievements, skills, socialLinks, contact } = portfolioData;

  return (
    <div className="bg-bg text-text min-h-screen font-sans">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection data={hero} />
              <section id="stats-education" className="scroll-mt-16">
                <StatsEducationSection data={{ stats, education }} />
              </section>
              <Divider />
              <section id="showcase" className="scroll-mt-16">
                <Showcase data={projects} achievementsData={achievements} />
              </section>
              <Divider />
              <section id="skills" className="scroll-mt-16">
                <SkillsSection data={skills} />
              </section>
              <Divider />
              <section id="contactSocial" className="scroll-mt-16">
                <ContactSocialSection contactData={contact} socialData={socialLinks} />
              </section>
              <Footer />
              <ScrollToTop />
            </>
          }
        />
        <Route path="/projects/all" element={<AllProjects />} />
        <Route path="/projects/:id" element={<ProjectDetail projects={projects} />} />
        <Route path="/achievements/all" element={<AllAchievements />} />
      </Routes>
    </div>
  );
}