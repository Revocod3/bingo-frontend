/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          dark: '#1E1B4B',
          light: '#3B0764',
        },
      },
      screens: {
        'xs': {'max': '375px'}, // Target very small screens specifically
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        pulse: 'pulse 1s ease-in-out infinite',
        'fade-out': 'fade-out 2s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.9, transform: 'scale(1.05)' },
        },
        'fade-out': {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
            opacity: 1, 
          },
          '50%': {
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)',
            opacity: 0.8, 
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};