import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Icon({ name, className = "" }) {
  const icons = {
    github: FaGithub,
    linkedin: FaLinkedin,
    twitter: FaTwitter,
  };
  // Default to FaGithub if name is not found
  const IconComponent = icons[name.toLowerCase()] || FaGithub; 
  return (
    <motion.div whileHover={{ scale: 1.2, color: "var(--accent)" }} transition={{ duration: 0.3 }} className="cursor-pointer">
      <IconComponent className={`text-3xl sm:text-4xl text-text hover:text-accent transition-colors ${className}`} />
    </motion.div>
  );
}