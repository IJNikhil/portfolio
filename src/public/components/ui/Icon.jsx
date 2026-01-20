import { Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export default function Icon({ name, className = "" }) {
  const icons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
  };
  // Default to Github if name is not found
  const IconComponent = icons[name.toLowerCase()] || Github;
  return (
    <motion.div whileHover={{ scale: 1.2, color: "var(--accent)" }} transition={{ duration: 0.3 }} className="cursor-pointer">
      <IconComponent size={32} className={`text-text hover:text-accent transition-colors ${className}`} />
    </motion.div>
  );
}