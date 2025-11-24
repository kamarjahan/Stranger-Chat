/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <--- THIS IS THE MAGIC LINE
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        oxford: "#0F172A",
        gold: "#C5A059",
        slate: {
          light: "#F8FAFC",
          gray: "#64748B",
          dark: "#020617", // New super dark color for background
          card: "#1E293B"  // New dark color for cards
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};