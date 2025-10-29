import { motion } from "framer-motion";

export default function GlassCard({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }} // Very subtle scale for glass
      // Improved glass effect: bg-card-light/20 and strong backdrop-blur
      className={`bg-card-light/20 backdrop-blur-xl p-6 sm:p-8 rounded-xl border border-gray-700/30 shadow-2xl transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}