export default function Container({ children, className = "" }) {
  return (
    <div className={`max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}