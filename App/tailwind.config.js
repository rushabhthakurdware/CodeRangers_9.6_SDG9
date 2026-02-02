/** @type {import('tailwindcss').Config} */
module.exports = {
  // ✅ Add darkMode: 'class' back
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // ✅ Register your theme variables
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
      }
    },
  },
  plugins: [],
};