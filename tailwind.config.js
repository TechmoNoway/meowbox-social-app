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
        "primary-500": "#8B5CF6",
        "primary-600": "#7C3AED",
        "primary-700": "#6D28D9",
        "secondary-500": "#EC4899",
        "secondary-600": "#DB2777",
        "accent-cyan": "#06B6D4",
        "accent-amber": "#F59E0B",
        "accent-emerald": "#10B981",
        "off-white": "#E2E8F0",
        red: "#EF4444",
        "dark-1": "#09090B",
        "dark-2": "#111116",
        "dark-3": "#181820",
        "dark-4": "#242430",
        "dark-5": "#323242",
        "light-1": "#FFFFFF",
        "light-2": "#F1F5F9",
        "light-3": "#94A3B8",
        "light-4": "#64748B",
      },
      screens: {
        xs: "480px",
      },
      width: {
        420: "420px",
        465: "465px",
      },
      fontFamily: {
        inter: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(139, 92, 246, 0.4)",
        "glow-pink": "0 0 25px -5px rgba(236, 72, 153, 0.4)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.4)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
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
        "pulse-subtle": {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.85, transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
