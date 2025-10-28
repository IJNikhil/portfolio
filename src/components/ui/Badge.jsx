import { motion } from "framer-motion";

export default function Badge({ children, className = "" }) {
  return (
    <motion.span
      whileHover={{ scale: 1.1, backgroundColor: "#007bff" }}
      className={`inline-block bg-card/30 backdrop-blur-sm text-text px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.span>
  );
}
