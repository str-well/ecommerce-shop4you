/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf6f3',
          100: '#f2e8e0',
          200: '#e6d5c7',
          300: '#d6bca5',
          400: '#c39d7c',
          500: '#b5815a',
          600: '#a76d4a',
          700: '#8c573c',
          800: '#724735',
          900: '#5d3b2e',
        },
      },
    },
  },
  plugins: [],
};
