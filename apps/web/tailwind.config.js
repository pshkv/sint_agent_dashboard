/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'notion-bg': '#ffffff',
        'notion-surface': '#f7f7f7',
        'notion-border': '#e0e0e0',
        'notion-text': '#1f1f1f',
        'notion-text-secondary': '#787774',
        'notion-accent': '#2383e2',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
