import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { scrollToSection } from "../utils/scrollUtils";

// Threshold for hiding navbar on scroll
const SCROLL_HIDE_THRESHOLD = 100;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  // Define navigation items
  const navItems = [
    { label: "Journey & Education", id: "stats-education" },
    { label: "Showcase", id: "showcase" },
    { label: "Skills", id: "skills" },
    { label: "Contact", id: "contact" },
  ];

  useEffect(() => {
    // Warn if section IDs are missing on initial load
    const checkSections = () => {
      navItems.forEach(item => {
        if (!document.getElementById(item.id)) {
          console.warn(`Section with ID "${item.id}" not found on initial load`);
        }
      });
    };
    const timeout = setTimeout(checkSections, 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Handle background blur & hide/show nav on scroll
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 50);

      if (currentScroll > SCROLL_HIDE_THRESHOLD) {
        setIsVisible(currentScroll < prevScrollPos);
      } else {
        setIsVisible(true);
      }
      setPrevScrollPos(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // Disable body scrolling when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const handleNavClick = (id) => {
    scrollToSection(id);
    setIsOpen(false);
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${scrolled ? "bg-bg/90 backdrop-blur-md shadow-xl py-3 border-b border-white/5"
          : "bg-transparent py-6"}
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo or clickable area for Hero section */}
        <button
          onClick={() => scrollToSection("hero")}
          className="text-2xl font-display font-bold text-white hover:text-accent transition-colors duration-300 tracking-wider"
          aria-label="Scroll to top (Hero Section)"
        >
          Nikhil.
        </button>
        {/* Navigation Links and Mobile Toggle */}
        <div className="flex items-center justify-end">
          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden text-gray-300 hover:text-accent transition-colors duration-300 p-2 z-[60]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {/* Link container: mobile & desktop */}
          <div
            className={`
              ${isOpen
                ? "flex opacity-100 translate-y-0 visible"
                : "invisible opacity-0 translate-y-[-10px]"
              }
              sm:flex sm:flex-row sm:gap-8 sm:visible sm:opacity-100 sm:translate-y-0
              absolute sm:static top-0 right-0
              w-full h-screen sm:w-auto sm:h-auto
              bg-bg/95 sm:bg-transparent
              flex-col justify-center items-center sm:flex-row sm:justify-end
              transition-all duration-300 ease-in-out z-50 backdrop-blur-xl sm:backdrop-blur-none
            `}
          >
            {/* Link Items */}
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                    text-2xl sm:text-base font-medium transition-all duration-300
                    py-4 sm:py-0 px-6 sm:px-0 w-full sm:w-auto text-center sm:text-left
                    border-b border-white/5 sm:border-0
                    relative group
                    ${isOpen ? "text-white" : "text-gray-400 hover:text-white"}
                  `}
              >
                {item.label}
                <span className="hidden sm:block absolute -bottom-1 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
