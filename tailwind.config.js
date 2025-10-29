/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Updated Color Palette based on CSS variables
      colors: {
        bg: "var(--bg)",
        text: "var(--text)",
        accent: "var(--accent)",
        "accent-dark": "var(--accent-dark)",
        "accent-secondary": "var(--accent-secondary)",
        card: "var(--card)",
        "card-light": "var(--card-light)", // New color for better glass contrast
      },
      // 2. Custom Font Family for better control
      fontFamily: {
        'sans': ['Lato', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'], // Mapping custom font to serif utility
      },
      // 3. Custom Keyframes for subtle card background effect
      keyframes: {
        'subtle-pulse': {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '1' },
        }
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 6s ease-in-out infinite',
      },
      // 4. Enhanced Typography Defaults
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--text)',
            lineHeight: '1.75',
            h1: { color: '#ffffff', marginBottom: '1rem' },
            h2: { color: '#ffffff', marginTop: '3rem', marginBottom: '1.5rem' },
            h3: { color: 'var(--text)', marginTop: '2rem', marginBottom: '1rem' },
            p: { marginTop: '1rem', marginBottom: '1.5rem' },
            a: { color: 'var(--accent)', textDecoration: 'none', fontWeight: '500' },
            strong: { color: '#fff' },
            code: { backgroundColor: 'var(--card-light)', color: 'var(--text)', padding: '2px 6px', borderRadius: '4px' },
            pre: {
              backgroundColor: 'var(--card)',
              padding: '1rem',
              borderRadius: '0.5rem',
              color: 'var(--text)',
              overflowX: 'auto',
            },
            img: { borderRadius: '0.75rem', marginTop: '1.5rem', marginBottom: '1.5rem' },
            ul: { marginTop: '1rem', marginBottom: '1.5rem', paddingLeft: '1.5rem' },
            li: { marginTop: '0.5rem', marginBottom: '0.5rem' },
            hr: { borderColor: '#374151', marginTop: '3rem', marginBottom: '3rem' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};



// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         bg: "var(--bg)",
//         text: "var(--text)",
//         accent: "var(--accent)",
//         "accent-dark": "var(--accent-dark)",
//         "accent-secondary": "var(--accent-secondary)",
//         card: "var(--card)",
//       },
//       typography: {
//         DEFAULT: {
//           css: {
//             color: '#d1d5db',
//             lineHeight: '1.8',
//             h1: { color: '#fff', marginBottom: '1rem' },
//             h2: { color: '#fff', marginTop: '2.5rem', marginBottom: '1rem' },
//             h3: { color: '#e5e7eb', marginTop: '2rem', marginBottom: '0.75rem' },
//             p: { marginTop: '0.8rem', marginBottom: '1.2rem' },
//             a: { color: 'var(--accent)', textDecoration: 'none' },
//             strong: { color: '#fff' },
//             code: { backgroundColor: '#1f2937', padding: '2px 6px', borderRadius: '4px' },
//             pre: {
//               backgroundColor: '#111827',
//               padding: '1rem',
//               borderRadius: '0.5rem',
//               color: '#e5e7eb',
//               overflowX: 'auto',
//             },
//             img: { borderRadius: '0.75rem', marginTop: '1.5rem', marginBottom: '1.5rem' },
//             ul: { marginTop: '1rem', marginBottom: '1.5rem', paddingLeft: '1.5rem' },
//             li: { marginTop: '0.5rem', marginBottom: '0.5rem' },
//             hr: { borderColor: '#374151', marginTop: '2rem', marginBottom: '2rem' },
//           },
//         },
//       },
//     },
//   },
//   plugins: [require('@tailwindcss/typography')],
// };
