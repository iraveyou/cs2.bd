const path = require('path')

module.exports = {
  content: [
    path.resolve(__dirname, './app/**/*.{ts,tsx,js,jsx}'),
    path.resolve(__dirname, './components/**/*.{ts,tsx,js,jsx}'),
  ],
  theme: {
    extend: {
      colors: {
        base: '#09090b',
        surface: '#18181b',
        card: '#18181b',
        border: '#27272a',
        muted: '#a1a1aa',
        subtle: '#3f3f46',
        text: '#ffffff',
        accent: '#22c55e',
        'accent-hover': '#16a34a',
        'accent-2': '#15803d',
        'accent-glow': 'rgba(34,197,94,0.15)',
        orange: {
          500: '#22c55e',
          400: '#16a34a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', '-apple-system'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,106,0,0.15), transparent)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.8), 0 0 0 1px rgba(28,28,38,0.8)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,106,0,0.2)',
        'glow-accent': '0 0 20px rgba(255,106,0,0.3)',
        'glow-sm': '0 0 12px rgba(255,106,0,0.2)',
        'nav': '0 1px 0 rgba(255,255,255,0.04)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(255,106,0,0.2)' },
          '50%': { boxShadow: '0 0 28px rgba(255,106,0,0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        'xl': '0.875rem',
        '2xl': '1.125rem',
      },
    },
  },
  plugins: [],
};
