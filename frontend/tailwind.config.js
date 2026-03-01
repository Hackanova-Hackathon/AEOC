/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand blues
        "brand-blue": "#2563eb",
        "brand-blue-light": "#3b82f6",
        "brand-blue-dark": "#1d4ed8",

        // Dark surface panels
        surface: {
          900: "#050d1a",
          800: "#0d1526",
          700: "#111f38",
          600: "#162644",
          500: "#1e3356",
        },

        // Accent / status colors
        accent: {
          green: "#22c55e",
          yellow: "#f59e0b",
          red: "#ef4444",
          blue: "#3b82f6",
          orange: "#f97316",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};