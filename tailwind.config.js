/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#2563eb',
        'surface': '#0d1526',
        'surface-2': '#111827',
      }
    }
  },
  plugins: []
}