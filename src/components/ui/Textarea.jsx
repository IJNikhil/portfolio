export default function Textarea({ className = "", ...props }) {
  return (
    <textarea
      // Updated styling for better glass aesthetic and clear focus ring
      className={`w-full p-3 bg-card-light/40 backdrop-blur-sm rounded-lg text-text placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-y transition-all duration-300 text-base min-h-[150px] ${className}`}
      {...props}
    />
  );
}