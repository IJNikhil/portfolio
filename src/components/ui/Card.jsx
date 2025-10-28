import { motion } from "framer-motion";

export default function Card({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
      className={`bg-card p-4 sm:p-6 rounded-lg border border-gray-800 ${className}`}
    >
      {children}
    </motion.div>
  );
}
