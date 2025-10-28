import { motion } from "framer-motion";
import Container from "./ui/Container";
import Navigation from "./Navigation";
import { scrollToSection } from "../utils/scrollUtils";
import fallbackAvatar from "../assets/hero-avatar.png";

export default function HeroSection({ data }) {
  const { firstName, lastName, intro, avatar } = data;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center bg-gradient-to-b from-[#090909] via-[#0d0d12] to-[#111827] overflow-hidden"
    >
      {/* === Navigation === */}
      <Navigation />

      {/* === Animated Grid Background === */}
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(90deg,_#00e0ff_1px,transparent_1px),linear-gradient(180deg,_#00e0ff_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_25s_linear_infinite]" />
      <style>
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

      {/* === Ambient Glows === */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 w-[400px] h-[400px] bg-[var(--accent)]/10 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[var(--accent-secondary)]/10 blur-[100px] animate-pulse-slow delay-500"></div>
      </div>

      <Container className="relative z-10 flex flex-col-reverse sm:flex-row items-center justify-between gap-10 sm:gap-16 lg:gap-24 px-6">
        {/* === Left — Text Section === */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center sm:text-left"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
            Hi, I’m{" "}
            <span className="text-[var(--accent)]">{firstName}</span>{" "}
            <span className="text-[var(--accent-secondary)]">{lastName}</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-lg mx-auto sm:mx-0 mb-8"
          >
            {intro}
          </motion.p>

          {/* === Buttons === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start"
          >
            <button
              onClick={() => scrollToSection("showcase")}
              className="px-6 py-3 bg-[var(--accent)] text-[var(--bg)] font-semibold rounded-xl shadow-md hover:bg-[var(--accent-secondary)] hover:shadow-[0_0_15px_var(--accent)] transition-all duration-300"
            >
              View Projects
            </button>
            <button
              onClick={() => scrollToSection("contactSocial")}
              className="px-6 py-3 border border-[var(--accent)] text-[var(--accent)] font-semibold rounded-xl hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300"
            >
              Contact Me
            </button>
          </motion.div>
        </motion.div>

        {/* === Right — Avatar Section (from last file) === */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 flex justify-center sm:justify-end relative"
        >
          {/* Subtle glowing halo behind avatar */}
          <div className="absolute inset-0 flex justify-center sm:justify-end items-center">
            <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-[var(--accent)]/10 blur-3xl animate-pulse-slow" />
          </div>

          {/* Avatar Image */}
          <img
            src={avatar || fallbackAvatar}
            alt={`${firstName} ${lastName}`}
            className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full object-cover border-4 border-[var(--accent)] shadow-[0_0_25px_var(--accent)] transition-transform duration-500 hover:scale-105"
            onError={(e) => (e.target.src = fallbackAvatar)}
          />
        </motion.div>
      </Container>
    </section>
  );
}
