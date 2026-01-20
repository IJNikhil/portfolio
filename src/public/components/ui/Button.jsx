import { motion } from "framer-motion";
import { cn } from "../../../shared/utils/cn";

export default function Button({ variant = "primary", children, onClick, className = "", ...props }) {
  const baseClasses = "rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent/50 text-base py-3 px-6 inline-flex justify-center items-center";
  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses = "bg-accent text-white hover:bg-accent-secondary hover:shadow-lg hover:shadow-accent/30";
      break;
    case "outline":
      variantClasses = "border-2 border-accent text-accent hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/30";
      break;
    case "ghost":
      variantClasses = "text-accent hover:bg-card/50 hover:text-accent-secondary";
      break;
    default:
      variantClasses = "bg-gray-700 text-white hover:bg-gray-600";
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }} // Subtle scale for interactive feel
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(baseClasses, variantClasses, className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}