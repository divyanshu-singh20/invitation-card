/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        coral: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd4cc',
          300: '#ffb8aa',
          400: '#ff9178',
          500: '#ff7456',
          600: '#f05a3c',
          700: '#d14427',
          800: '#b33721',
          900: '#942f1f',
        },
      },
    },
  },
  plugins: [],
}
