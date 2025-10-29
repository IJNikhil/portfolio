import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
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
    { label: "Contact", id: "contactSocial" },
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
        ${scrolled ? "bg-gray-900/90 backdrop-blur-sm shadow-xl py-3 sm:py-4"
                   : "bg-transparent py-4 sm:py-5"}
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo or clickable area for Hero section */}
        <button
          onClick={() => scrollToSection("hero")}
          className="text-xl sm:text-2xl font-serif font-bold text-transparent hover:text-[var(--accent)] transition-colors duration-300 tracking-wider"
          aria-label="Scroll to top (Hero Section)"
        >
          &nbsp;
        </button>
        {/* Navigation Links and Mobile Toggle */}
        <div className="flex items-center justify-end">
          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden text-gray-300 hover:text-[var(--accent)] text-3xl transition-colors duration-300 p-2 z-[60]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
          {/* Link container: mobile & desktop */}
          <div
            className={`
              ${isOpen
                ? "flex opacity-100 translate-y-0 visible"
                : "invisible opacity-0 translate-y-[-10px]"
              }
              sm:flex sm:flex-row sm:gap-6 sm:visible sm:opacity-100 sm:translate-y-0
              absolute sm:static top-full sm:top-auto right-0
              left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0
              w-11/12 max-w-xs sm:w-auto
              bg-gray-900/90 sm:bg-transparent rounded-b-lg sm:rounded-none shadow-2xl sm:shadow-none
              transition-all duration-300 ease-in-out z-50 p-2 sm:p-0 backdrop-blur-md
            `}
          >
            {/* MOBILE Links */}
            <div className="flex flex-col w-full sm:hidden">
              {navItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    text-gray-300 hover:text-[var(--accent)] text-lg font-medium transition-all duration-300
                    py-3 px-5 w-full text-left border-b border-gray-700/50 last:border-b-0
                    relative group
                    ${isOpen
                      ? "translate-y-0 opacity-100 delay-[75ms]"
                      : "translate-y-2 opacity-0"}
                  `}
                  aria-label={`Scroll to ${item.label} section`}
                  style={isOpen ? { transitionDelay: `${idx * 75}ms` } : {}}
                >
                  {item.label.replace(' & Education', '')}
                </button>
              ))}
            </div>
            {/* DESKTOP links */}
            <div className="hidden sm:flex sm:flex-row sm:gap-6 sm:visible">
              {navItems.map(item => (
                <button
                  key={`desktop-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className="
                    text-gray-300 hover:text-[var(--accent)] text-lg font-medium transition-all duration-300 py-0 px-3
                    relative group min-w-[70px] text-center
                  "
                  aria-label={`Scroll to ${item.label} section`}
                >
                  {item.label.replace(' & Education', '')}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-x-100 scale-x-0 origin-left"></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
