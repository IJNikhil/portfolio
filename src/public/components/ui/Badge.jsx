// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Badge({ children, className = "" }) {
  return (
    <motion.span
      // Enhanced hover: subtle scale and accent background
      whileHover={{ scale: 1.05, backgroundColor: "#0099ff" }}
      // Improved glass look: better background opacity and border
      className={`inline-block bg-card/50 backdrop-blur-md text-text px-3 sm:px-4 py-1 rounded-full font-medium transition-colors duration-300 border border-gray-700/50 hover:text-white hover:border-accent-dark cursor-pointer ${className}`}
    >
      {children}
    </motion.span>
  );
}