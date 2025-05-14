import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'font-montserrat',
    'font-inter',
    'font-roboto-mono',
    'text-brand-off-white', 
    'bg-black', 
    'bg-[#3b82f6]', 
    'text-white', 
    'border-gray-800',
    'border-white', 
    'border-[#3b82f6]', 
    'hover:bg-[#2563eb]', 
    'hover:text-white',
    'hover:text-brand-off-white',
    'hover:border-[#3b82f6]', 
  ],
  theme: {
    extend: {
      colors: {
        'primary-accent': '#0073E6',     // --primary-accent (Blue)
        'secondary-accent': '#50E3C2',   // --secondary-accent (Minty Teal)
        'brand-bg': '#070707',           // --bg-color (Deep Black)
        'brand-text': '#A0A0A0',         // --text-color (Refined Gray)
        'brand-true-black': '#000000',   // True Black (for elements needing pure black)
        'brand-pure-white': '#FFFFFF',   // --highlight-color (Pure White)
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],        // Use CSS variable for Inter
        heading: ['var(--font-montserrat)', 'sans-serif'], // Use CSS variable for Montserrat
        mono: ['var(--font-roboto-mono)', 'monospace'],    // Use CSS variable for Roboto Mono
      },
      transitionTimingFunction: {
        'display': 'cubic-bezier(0.83, 0, 0.17, 1)', // --easing-curve-display
        'interactive': 'cubic-bezier(0.4, 0, 0.2, 1)', // --easing-curve-interactive
      },
      transitionDuration: {
        'epic': '2000ms',   // --transition-duration-epic (2s)
        'slow': '1500ms',   // --transition-duration-slow (1.5s)
        'medium': '900ms',  // --transition-duration-medium (0.9s)
        'fast': '600ms',    // --transition-duration-fast (0.6s)
      },
    },
  },
  plugins: [],
};

export default config;
