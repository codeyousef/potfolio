/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'deep-black': '#000000',
        'teal-accent': '#38B2AC',
        'maroon-accent': '#9B2C2C',
        'navy-accent': '#2C5282',
        
        // Neutral Shades
        'gray-900': '#1A202C',
        'gray-800': '#2D3748',
        'gray-700': '#4A5568',
        'gray-600': '#718096',
        'gray-500': '#A0AEC0',
        'gray-400': '#CBD5E0',
        'gray-300': '#E2E8F0',
      },
      fontFamily: {
        'primary': ['"Neue Haas Grotesk"', 'Inter', 'sans-serif'],
        'secondary': ['"Playfair Display"', 'serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
        'arabic': ['"Aref Ruqaa"', 'serif'],
      },
      fontSize: {
        'display': '4rem',      // 64px
        'h1': '3rem',           // 48px
        'h2': '2.25rem',        // 36px
        'h3': '1.875rem',       // 30px
        'h4': '1.5rem',         // 24px
        'h5': '1.25rem',        // 20px
        'h6': '1.125rem',       // 18px
        'body': '1rem',         // 16px
        'small': '0.875rem',    // 14px
        'xsmall': '0.75rem',    // 12px
      },
      lineHeight: {
        'tight': '1.1',
        'normal': '1.5',
        'relaxed': '1.75',
        'loose': '2',
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [],
}