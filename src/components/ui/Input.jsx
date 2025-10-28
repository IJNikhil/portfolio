export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full p-2 sm:p-3 bg-card/30 backdrop-blur-sm rounded-lg text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base ${className}`}
      {...props}
    />
  );
}