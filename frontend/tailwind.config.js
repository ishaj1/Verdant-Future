/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGreen: {
          50: '#f0f7ed',
          100: '#d9ebd2',
          200: '#bde0b1',
          300: '#9cc88b',
          400: '#7eaf65',
          500: '#629344', // Main green color
          600: '#507e38',
          700: '#3f622d',
          800: '#334d24',
          900: '#27391b',
        },
      },
    fontFamily: {
      abeezee: ['ABeeZee', "sans-serif"],
    }
    },
  },
  plugins: [],
}

