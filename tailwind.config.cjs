/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enables .dark class support
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"], // Explicitly matching reference
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        // Shared/Legacy
        primary: {
          DEFAULT: "#3e3e79", // Tech Focus Purple/Indigo (Primary in Ref)
          teal: "#00c2a5", // Legacy/Admin Teal
          hover: "#323266",
        },
        accent: {
          DEFAULT: "#2ADCE0", // Tech Focus Cyan
          teal: "#2ADCE0",
        },
        background: {
          light: "#f6f6f7",
          DEFAULT: "#16161c", // Tech Focus Dark (Defaulting to dark for public)
          dark: "#16161c",
          "card-dark": "#1d1d26", // Tech Focus Card
          admin: "#0f2320", // Keeping Admin Dark Green separate
        },
        surface: {
          DEFAULT: "#1d1d26",
          dark: "#1d1d26",
        },
        text: {
          main: "#f1f5f9", // Light text for dark mode default
          muted: "#94a3b8", // Slate-400 equivalent
          inverse: "#101817",
        },
        border: "#3e3e79", // Primary/20 equivalent often used
        "border-dark": "#2a3f3b",
      },
      backgroundImage: {
        "glass-gradient": "radial-gradient(#cbd5e1 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 194, 165, 0.5)",
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
