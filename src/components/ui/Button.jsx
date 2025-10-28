import { motion } from "framer-motion";

export default function Button({ variant = "primary", children, onClick, className = "", ...props }) {
  const baseClasses = "rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent/50 text-sm sm:text-base";
  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses = "bg-accent text-white py-2 sm:py-3 px-4 sm:px-6 hover:bg-accent-dark hover:scale-105";
      break;
    case "outline":
      variantClasses = "border-2 border-accent text-accent py-2 sm:py-3 px-4 sm:px-6 hover:bg-accent hover:text-white hover:scale-105";
      break;
    case "ghost":
      variantClasses = "text-accent py-1 sm:py-2 px-3 sm:px-4 hover:bg-card/50 hover:scale-105";
      break;
    default:
      variantClasses = "bg-gray-700 text-white py-2 sm:py-3 px-4 sm:px-6 hover:bg-gray-600";
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}