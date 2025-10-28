import { motion } from "framer-motion";

export default function SectionTitle({ children, className = "" }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`text-2xl sm:text-3xl md:text-4xl font-bold text-text mb-6 sm:mb-8 md:mb-10 tracking-tight text-center font-serif ${className}`}
    >
      {children}
    </motion.h2>
  );
}