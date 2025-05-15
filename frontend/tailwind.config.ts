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
    'bg-primary-accent', 
    'text-white', 
    'border-gray-800',
    'border-white', 
    'border-primary-accent', 
    'hover:bg-primary-accent-dark', 
    'hover:text-white',
    'hover:text-brand-off-white',
    'hover:border-primary-accent', 
    // Emergence phase-related classes
    'phase-seed',
    'phase-growth',
    'phase-bloom',
  ],
  theme: {
    extend: {
      colors: {
        // Emergence theme palette
        'primary-accent': '#0073E6',     // Blue accent
        'primary-accent-dark': '#0052A3', // Darker blue for hover states
        'secondary-accent': '#50E3C2',   // Minty Teal accent
        'tertiary-accent': '#F0C3FF',    // Subtle lavender accent
        
        // Base brand colors
        'brand-bg': '#070707',           // Deep Black background
        'brand-text': '#A0A0A0',         // Refined Gray for body text
        'brand-off-white': '#F0F0F0',    // Off-white for contrast
        'brand-true-black': '#000000',   // True Black (for elements needing pure black)
        'brand-pure-white': '#FFFFFF',   // Pure White for highlights
        
        // Emergence phase-specific colors
        'seed-bg': '#050505',            // Darker background for Seed/Veil phase
        'seed-text': '#707070',          // Muted text for Seed/Veil phase
        'seed-accent': '#293D5C',        // Muted accent for Seed/Veil phase
        
        'growth-bg': '#0F0F0F',          // Transitional background for Growth phase
        'growth-text': '#B0B0B0',        // Brightening text for Growth phase
        'growth-accent': '#0062C4',      // Brightening accent for Growth phase
        
        'bloom-bg': '#121212',           // Final bright background for Bloom phase
        'bloom-text': '#D0D0D0',         // Bright text for Bloom phase
        'bloom-accent': '#0073E6',       // Full accent for Bloom phase
        
        // Conversion element colors
        'cta-primary': '#0073E6',        // Primary CTA color
        'cta-secondary': '#50E3C2',      // Secondary CTA color
        'cta-highlight': '#FFFFFF',      // CTA highlight color
        'cta-subtle': 'rgba(80, 227, 194, 0.15)', // Subtle background for secondary CTAs
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],        // Base body font
        heading: ['var(--font-montserrat)', 'sans-serif'], // Primary heading font
        mono: ['var(--font-roboto-mono)', 'monospace'],    // Monospace for code & UI elements
        display: ['var(--font-montserrat)', 'sans-serif'], // Display heading (can be customized later)
      },
      transitionTimingFunction: {
        'display': 'cubic-bezier(0.83, 0, 0.17, 1)',      // Dramatic, exhibition-style transitions
        'interactive': 'cubic-bezier(0.4, 0, 0.2, 1)',    // Responsive interactive elements
        'emergence': 'cubic-bezier(0.16, 1, 0.3, 1)',     // Special curve for emergence animations
        'bloom': 'cubic-bezier(0.34, 1.56, 0.64, 1)',     // Slightly bouncy for bloom phase
      },
      transitionDuration: {
        'epic': '2000ms',     // Very slow, dramatic transitions
        'slow': '1500ms',     // Slow transitions
        'medium': '900ms',    // Medium transitions
        'fast': '600ms',      // Fast transitions
        'quick': '300ms',     // Quick microinteractions
      },
      spacing: {
        '128': '32rem',       // Extra large spacing
        '144': '36rem',       // XXL spacing
      },
      borderWidth: {
        'hairline': '0.5px',  // Ultra-thin border for high fashion elements
      },
      boxShadow: {
        'inner-glow': 'inset 0 0 20px 5px rgba(255, 255, 255, 0.05)',
        'outer-glow': '0 0 15px 2px rgba(255, 255, 255, 0.1)',
        'cta': '0 0 25px rgba(0, 115, 230, 0.4)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-medium': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 1.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite linear',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
