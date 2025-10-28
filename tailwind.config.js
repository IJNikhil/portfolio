/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        text: "var(--text)",
        accent: "var(--accent)",
        "accent-dark": "var(--accent-dark)",
        "accent-secondary": "var(--accent-secondary)",
        card: "var(--card)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#d1d5db',
            lineHeight: '1.8',
            h1: { color: '#fff', marginBottom: '1rem' },
            h2: { color: '#fff', marginTop: '2.5rem', marginBottom: '1rem' },
            h3: { color: '#e5e7eb', marginTop: '2rem', marginBottom: '0.75rem' },
            p: { marginTop: '0.8rem', marginBottom: '1.2rem' },
            a: { color: 'var(--accent)', textDecoration: 'none' },
            strong: { color: '#fff' },
            code: { backgroundColor: '#1f2937', padding: '2px 6px', borderRadius: '4px' },
            pre: {
              backgroundColor: '#111827',
              padding: '1rem',
              borderRadius: '0.5rem',
              color: '#e5e7eb',
              overflowX: 'auto',
            },
            img: { borderRadius: '0.75rem', marginTop: '1.5rem', marginBottom: '1.5rem' },
            ul: { marginTop: '1rem', marginBottom: '1.5rem', paddingLeft: '1.5rem' },
            li: { marginTop: '0.5rem', marginBottom: '0.5rem' },
            hr: { borderColor: '#374151', marginTop: '2rem', marginBottom: '2rem' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};






// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,jsx}'],
//   theme: {
//     extend: {
//       colors: {
//         bg: '#0a0a0a',
//         text: '#e0e0e0',
//         accent: '#007bff',
//         'accent-dark': '#0056b3',
//         card: '#1e1e1e',
//       },
//       fontFamily: {
//         serif: ['Playfair Display', 'serif'],
//         sans: ['Lato', 'sans-serif'],
//       },
//       spacing: {
//         'gr': '1.618rem',
//       },
//       fontSize: {
//         'gr-sm': '1rem',
//         'gr-md': '1.618rem',
//         'gr-lg': '2.618rem',
//       },
//       boxShadow: {
//         'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
//       },
//       backdropBlur: {
//         xs: '2px',
//       },
//     },
//   },
//   plugins: [[require("@tailwindcss/typography")]],
// };
