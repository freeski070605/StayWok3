/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#FFA726", // Light orange
          DEFAULT: "#FF9800", // Standard orange
          dark: "#F57C00", // Dark orange
        },
        secondary: {
          light: "#1F1F1F", // Light black/gray
          DEFAULT: "#000000", // Pure black
          dark: "#0A0A0A", // Deep black
        },
        accent: {
          DEFAULT: "#FFD600", // Bright gold for accents
        },
      },
    },
  },
  plugins: [],
};
