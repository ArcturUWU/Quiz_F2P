/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'neon-purple': '#8A2BE2',
        'neon-blue': '#00BFFF',
        'neon-pink': '#FF1493',
        'neon-green': '#00FF7F',
        'neon-orange': '#FF4500',
      },
      boxShadow: {
        'neon': '0 0 15px rgba(var(--primary-color-rgb), 0.7)',
        'neon-sm': '0 0 5px rgba(var(--primary-color-rgb), 0.5)',
        'neon-lg': '0 0 25px rgba(var(--primary-color-rgb), 0.9)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
