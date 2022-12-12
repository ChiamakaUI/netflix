/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black-overlay': 'rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
