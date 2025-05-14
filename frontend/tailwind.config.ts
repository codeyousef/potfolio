import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-accent': '#3b82f6', // Blue-500
        'secondary-accent': '#14b8a6', // Teal-500
        'brand-dark-gray': '#1a1a1a', // Dark Gray from Portfolio.md
        'brand-off-white': '#f0f0f0', // Off-White from Portfolio.md
        'brand-true-black': '#000000', // True Black from Portfolio.md
        'brand-pure-white': '#ffffff', // Pure White from Portfolio.md
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'], 
        mono: ['Roboto Mono', 'monospace'],
      },
      // Example: Add a subtle pulse animation for CTAs if needed later
      // keyframes: {
      //   pulse: {
      //     '0%, 100%': { opacity: '1' },
      //     '50%': { opacity: '.5' },
      //   },
      // },
      // animation: {
      //   pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      // },
    },
  },
  plugins: [],
};

export default config;
