import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { scrollToSection } from "../utils/scrollUtils";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Journey & Education", id: "stats-education" },
    { label: "Showcase", id: "showcase" },
    { label: "Skills", id: "skills" },
    { label: "Contact", id: "contactSocial" },
  ];

  useEffect(() => {
    const checkSections = () => {
      navItems.forEach((item) => {
        if (!document.getElementById(item.id)) {
          console.warn(`Section with ID "${item.id}" not found on initial load`);
        }
      });
    };
    const timeout = setTimeout(checkSections, 0);
    return () => clearTimeout(timeout);
  }, []);

  const handleScroll = (id) => {
    scrollToSection(id);
    setIsOpen(false);
  };

  return (
    <nav
      className="absolute top-4 left-0 right-0 z-10 p-4 sm:p-6"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-between items-center sm:justify-end">
        {/* Mobile Menu Toggle */}
        <button
          className="sm:hidden text-gray-300 hover:text-[var(--accent)] text-2xl transition-colors duration-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row sm:gap-6 bg-gray-900/90 sm:bg-transparent absolute sm:static top-12 left-0 right-0 p-4 sm:p-0 rounded-b-lg sm:rounded-none backdrop-blur-md`}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleScroll(item.id)}
              className="text-gray-300 hover:text-[var(--accent)] text-base sm:text-lg font-medium transition-all duration-300 py-2 sm:py-0"
              aria-label={`Scroll to ${item.label} section`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
