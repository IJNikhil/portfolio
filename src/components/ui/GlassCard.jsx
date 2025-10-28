import { motion } from "framer-motion";

export default function GlassCard({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`bg-card/30 backdrop-blur-md p-4 sm:p-6 rounded-lg border border-gray-700/50 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}