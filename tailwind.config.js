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
        '2xs': {'max': '374px'},      // Extra extra small devices (smaller than iPhone SE)
        'xs': {'min': '375px', 'max': '639px'}, // Small phones to larger phones
        // sm starts at 640px by default in Tailwind
      },
    },
  },
  plugins: [],
};