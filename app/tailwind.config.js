/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Obsidian base
        obsidian: {
          900: '#08080C',
          800: '#0A0A0F',
          700: '#101018',
          600: '#16161F',
          500: '#1E1E2A',
          400: '#2A2A38',
        },
        // Primary violet
        violet: {
          DEFAULT: '#7C3AED',
          glow: '#9D5CFF',
          deep: '#5B21B6',
        },
        // Secondary cyan
        cyber: {
          DEFAULT: '#22D3EE',
          glow: '#67E8F9',
          deep: '#0E7490',
        },
        signal: {
          green: '#34D399',
          amber: '#FBBF24',
          red: '#F87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(124, 58, 237, 0.55)',
        'glow-cyan': '0 0 24px -4px rgba(34, 211, 238, 0.5)',
        glass: 'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 8px 32px -8px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.12), transparent 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
