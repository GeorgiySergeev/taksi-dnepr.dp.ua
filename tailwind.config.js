/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{html,js,css}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#facc15', // yellow-400
          light: '#fde047',   // yellow-300
          dark: '#eab308',    // yellow-500
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'landing': '72rem',
      },
      screens: {
        'xs': '375px',
      },
      borderRadius: {
        'card': '1rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
