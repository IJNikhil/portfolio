import { Link } from "react-router-dom";

export default function AnimatedLink({ to, children, className, ...props }) {
  return (
    <Link
      to={to}
      className={`transition-transform duration-300 hover:scale-105 hover:text-accent-dark ${className}`}
      style={{ minHeight: '44px', minWidth: '44px' }}
      {...props}
      aria-label={`Navigate to ${to}`}
    >
      {children}
    </Link>
  );
}