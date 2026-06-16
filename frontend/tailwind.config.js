/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#E9F2F3',
          100: '#BCD9DA',
          200: '#8FBFC2',
          300: '#4B999D',
          400: '#1E7F84',
          500: '#1E7F84',
          600: '#1A6E72',
          700: '#15595D',
          800: '#11484B',
          900: '#0C373A',
          950: '#072628',
        },
        lavender: {
          50:  '#E9F2F3',
          100: '#BCD9DA',
          200: '#8FBFC2',
          300: '#8FBFC2',
          400: '#4B999D',
          500: '#1E7F84',
          600: '#1A6E72',
          700: '#15595D',
          800: '#11484B',
          900: '#0C373A',
        },
        health: {
          green:  '#10b981',
          yellow: '#f59e0b',
          red:    '#ef4444',
          blue:   '#1E7F84',
          purple: '#4B999D',
          pink:   '#8FBFC2',
        },
        glass: {
          white: 'rgba(255,255,255,0.75)',
          light: 'rgba(255,255,255,0.45)',
          dark:  'rgba(0,0,0,0.05)',
        },
      },
      backgroundImage: {
        'gradient-health': 'linear-gradient(135deg, #1E7F84 0%, #8FBFC2 100%)',
        'gradient-lavender': 'linear-gradient(135deg, #E9F2F3 0%, #BCD9DA 50%, #8FBFC2 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.76) 100%)',
        'gradient-primary': 'linear-gradient(135deg, #1E7F84 0%, #4B999D 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-danger': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'gradient-warning': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-purple': 'linear-gradient(135deg, #4B999D 0%, #1E7F84 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(31,38,135,0.07)',
        'glass-lg': '0 16px 48px rgba(31,38,135,0.1)',
        'card': '0 4px 24px rgba(94,114,228,0.08)',
        'card-hover': '0 12px 40px rgba(94,114,228,0.15)',
        'inner-light': 'inset 0 1px 0 rgba(255,255,255,0.6)',
        'float': '0 20px 60px rgba(94,114,228,0.12)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'scale(0.95)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
