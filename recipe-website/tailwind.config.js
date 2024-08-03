/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fancy: ['Cormorant', 'sans-serif'],
        sans: ['Helvetica', 'Arial', 'sans-serif'],
        handwritten: ['"Indie Flower"', 'cursive'],
        cormorant: ['Cormorant', 'sans-serif'],
      },
      colors: {
        primary: '#6B8E23',
      },
    },
  },
  plugins: [],
}

