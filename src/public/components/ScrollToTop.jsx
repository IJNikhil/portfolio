import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollUp}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-accent text-white shadow-lg hover:bg-accent-secondary hover:scale-110 transition-all duration-300 z-50 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={24} />
    </button>
  );
}