import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Icon({ name, className = "" }) {
  const icons = {
    github: FaGithub,
    linkedin: FaLinkedin,
    twitter: FaTwitter,
  };
  const IconComponent = icons[name.toLowerCase()] || FaGithub;
  return (
    <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
      <IconComponent className={`text-3xl sm:text-4xl ${className}`} />
    </motion.div>
  );
}