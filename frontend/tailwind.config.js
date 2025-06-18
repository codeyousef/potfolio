/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NEON BRUTALISM COLORS
        'violence-pink': '#FF006E',
        'toxic-green': '#00F5FF',
        'warning-yellow': '#FFBE0B',
        'void-black': '#000000',
        'ghost-white': '#FFFFFF',
        'glitch': {
          1: '#00FFFF',
          2: '#FF00FF',
          3: '#FFFF00',
        },
        // Keep old colors for gradual migration
        primary: {
          base: '#A47864',
          dark: '#8B6352',
          light: '#C39B87',
        },
        accent: {
          primary: '#00D9FF',
          hover: '#00B8E6',
        },
        highlight: {
          DEFAULT: '#FFDD44',
          hover: '#FFD700',
        },
        bg: {
          dark: '#0A0A0A',
          'section-1': '#121212',
          'section-2': '#1A1A1A',
          card: '#242424',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B8B8B8',
          muted: '#6B6B6B',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
      },
      animation: {
        'aurora-flow': 'aurora-flow 20s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
      },
      keyframes: {
        'aurora-flow': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-card': 'var(--gradient-card)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}