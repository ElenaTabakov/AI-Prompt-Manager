export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Your custom color palette
        // Usage: bg-brand-500 dark:bg-brand-400
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Surface colors for backgrounds
        surface: {
          light: '#ffffff',
          dark: '#1f2937',
        },
        // Text colors
        content: {
          light: '#111827',
          dark: '#f9fafb',
        },
      },
    },
  },
  plugins: [],
}
