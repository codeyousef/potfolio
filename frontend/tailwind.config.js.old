/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'background': 'var(--bg-color)',
        'text': 'var(--text-color)',
        'highlight': 'var(--highlight-color)',
        'primary': 'var(--primary-accent)',
        'secondary': 'var(--secondary-accent)',
        
        // Emergence Theme - Seed Phase (Veil)
        'seed-bg': '#080808',
        'seed-text': '#c0c0c0',
        'seed-accent': '#313d5a',
        'seed-highlight': '#424e6b',
        
        // Emergence Theme - Growth Phase (Unfurling)
        'growth-bg': '#0a0a0a',
        'growth-text': '#d0d0d0',
        'growth-accent': '#446a5c',
        'growth-highlight': '#568b79',
        
        // Emergence Theme - Bloom Phase (Horizon)
        'bloom-bg': '#0c0c0c', 
        'bloom-text': '#e0e0e0',
        'bloom-accent': '#8f6e93',
        'bloom-highlight': '#b28ab7',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        montserrat: ['var(--font-montserrat)'],
        mono: ['var(--font-roboto-mono)'],
        heading: ['var(--font-montserrat)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 1.5s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-down': 'slideDown 0.8s ease-out forwards',
        'pulse-gentle': 'pulseGentle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        pulseGentle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      transitionTimingFunction: {
        'emergence': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bloom': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
