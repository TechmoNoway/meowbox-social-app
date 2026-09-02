/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Instagram Theme Colors
        "primary-500": "#0095F6", // Instagram Royal Blue
        "primary-600": "#1877F2",
        "primary-700": "#0C63D4",
        "secondary-500": "#ED4956", // Instagram Heart Red
        "secondary-600": "#DC2743",
        "accent-cyan": "#00F2FE",
        "accent-amber": "#F59E0B",
        "accent-emerald": "#10B981",
        "ig-story-orange": "#F58529",
        "ig-story-pink": "#DD2A7B",
        "ig-story-purple": "#8134AF",
        "off-white": "#F5F5F5",
        red: "#ED4956",
        "dark-1": "#000000", // True Pitch Black OLED
        "dark-2": "#121212", // Elevated dark surface
        "dark-3": "#1A1A1A", // Subtle hover surface
        "dark-4": "#262626", // Instagram standard border
        "dark-5": "#363636",
        "light-1": "#FFFFFF",
        "light-2": "#F5F5F5",
        "light-3": "#A8A8A8", // Muted text
        "light-4": "#737373", // Subtle timestamp text
      },
      screens: {
        xs: "480px",
      },
      width: {
        420: "420px",
        465: "465px",
      },
      fontFamily: {
        inter: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
          ...defaultTheme.fontFamily.sans,
        ],
      },
      boxShadow: {
        glow: "0 0 20px -3px rgba(0, 149, 246, 0.4)",
        "glow-pink": "0 0 20px -3px rgba(237, 73, 86, 0.4)",
        "glow-story": "0 0 20px -2px rgba(221, 42, 123, 0.4)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "like-bounce": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
        "fade-in": {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "like-bounce": "like-bounce 0.45s ease-in-out",
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
