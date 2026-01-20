// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function SectionTitle({ children, className = "" }) {
  return (
    <motion.h2
      // Increased y-movement for a more dramatic entry
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }} // Added amount for earlier trigger
      transition={{ duration: 0.8, ease: "easeOut" }} // Smoother transition
      // Larger text, bold, using the custom font-serif
      className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-text mb-8 sm:mb-10 md:mb-12 tracking-tight text-center font-serif ${className}`}
    >
      {children}
    </motion.h2>
  );
}