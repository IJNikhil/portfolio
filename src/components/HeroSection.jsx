import { motion } from "framer-motion";
import Container from "./ui/Container";
import Navigation from "./Navigation";
import Button from "./ui/Button"; // 💡 Imported the custom Button component
import { scrollToSection } from "../utils/scrollUtils";
import fallbackAvatar from "../assets/hero-avatar.png";

export default function HeroSection({ data }) {
  // Destructure with robust fallbacks
  const firstName = data?.firstName || "Nikhileshwar";
  const lastName = data?.lastName || "Adam";
  const intro = data?.intro || "A dedicated Full Stack Developer specializing in React, Node.js, and modern architectural patterns. I build robust, high-performance web applications from concept to deployment.";
  const avatar = data?.avatar;

  return (
    <section
      id="hero"
      // Added vertical padding based on Navigation height for content safety
      className="relative min-h-[85vh] sm:min-h-screen flex items-center pt-28 pb-16 
                 bg-gradient-to-b from-[#090909] via-[#0d0d12] to-[#111827] overflow-hidden"
    >
      {/* === Navigation === */}
      <Navigation />

      {/* === Animated Grid Background === (ORIGINAL - NO CHANGES HERE) */}
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(90deg,_#00e0ff_1px,transparent_1px),linear-gradient(180deg,_#00e0ff_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_25s_linear_infinite]" />
      <style jsx="true">
        {`
          @keyframes moveGrid {
            from { background-position: 0 0, 0 0; }
            to { background-position: 40px 40px, 40px 40px; }
          }
          @keyframes pulseSlow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          .animate-pulse-slow {
            animation: pulseSlow 6s ease-in-out infinite;
          }
        `}
      </style>

      {/* === Ambient Glows === (ORIGINAL - NO CHANGES HERE) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 w-[400px] h-[400px] bg-[var(--accent)]/10 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[var(--accent-secondary)]/10 blur-[100px] animate-pulse-slow delay-500"></div>
      </div>

      <Container className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 sm:gap-16 px-4 sm:px-6 lg:px-8">
        
        {/* === Left — Text Section (Takes up 60% of desktop space) === */}
        <motion.div
          initial={{ opacity: 0, x: -80 }} // Increased travel distance for smoother entry
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, type: "spring", stiffness: 100 }}
          className="lg:w-3/5 text-center lg:text-left" 
        >
          {/* Enhanced Typography: Larger, use font-serif, and stronger shadow */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight font-serif 
                       drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
            Hi, I’m{" "}
            <span className="text-[var(--accent)]">{firstName}</span>{" "}
            <span className="text-[var(--accent-secondary)]">{lastName}</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-gray-400 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-10 tracking-wide"
          >
            {intro}
          </motion.p>

          {/* === Buttons (Now using the custom Button component) === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Button
              variant="primary"
              onClick={() => scrollToSection("showcase")}
              // Added custom shadow for better visual depth
              className="text-lg shadow-[0_4px_20px_var(--accent)/40]"
            >
              View Projects
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("contactSocial")}
              className="text-lg"
            >
              Contact Me
            </Button>
          </motion.div>
        </motion.div>

        {/* === Right — Avatar Section (40% of desktop space) === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.3, type: "spring", stiffness: 50 }}
          className="lg:w-2/5 flex justify-center lg:justify-end relative mb-10 lg:mb-0"
        >
          {/* Subtle glowing halo behind avatar */}
          <div className="absolute inset-0 flex justify-center lg:justify-end items-center">
            <div className="w-80 h-80 sm:w-96 sm:h-96 md:w-[450px] md:h-[450px] rounded-full bg-[var(--accent)]/10 blur-3xl animate-pulse-slow" />
          </div>

          {/* Avatar Image: Enhanced shadow for high-contrast visibility */}
          <img
            src={avatar || fallbackAvatar}
            alt={`${firstName} ${lastName}`}
            className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full object-cover border-4 border-[var(--accent)] shadow-[0_0_35px_var(--accent)/60] transition-transform duration-500 hover:scale-[1.03]"
            onError={(e) => (e.target.src = fallbackAvatar)}
          />
        </motion.div>
      </Container>
    </section>
  );
}