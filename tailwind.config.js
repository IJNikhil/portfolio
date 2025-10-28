/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        text: '#e0e0e0',
        accent: '#007bff',
        'accent-dark': '#0056b3',
        card: '#1e1e1e',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
      spacing: {
        'gr': '1.618rem',
      },
      fontSize: {
        'gr-sm': '1rem',
        'gr-md': '1.618rem',
        'gr-lg': '2.618rem',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [[require("@tailwindcss/typography")]],
};



// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//         "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}"
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

