// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Card({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.4)" }} // Deeper shadow
      // Subtle background pulse animation added
      className={`bg-card p-6 sm:p-8 rounded-xl border border-gray-800/80 transition-shadow duration-300 animate-subtle-pulse ${className}`}
    >
      {children}
    </motion.div>
  );
}