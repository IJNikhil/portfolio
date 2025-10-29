export default function Input({ className = "", ...props }) {
  return (
    <input
      // Updated styling for better glass aesthetic and clear focus ring
      className={`w-full p-3 bg-card-light/40 backdrop-blur-sm rounded-lg text-text placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 text-base ${className}`}
      {...props}
    />
  );
}