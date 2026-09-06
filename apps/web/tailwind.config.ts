import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

/**
 * XYZ Eyewear Design System
 * Full Tailwind design token system — typography, colors, spacing, shadows, animations
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ─── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        // Editorial serif for headings (luxury feel)
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', ...fontFamily.serif],
        // Clean sans for body text, UI
        sans: ['var(--font-inter)', 'Inter', ...fontFamily.sans],
        // Monospace for codes/numbers (price tags, order numbers)
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', ...fontFamily.mono],
      },
      fontSize: {
        // Display (editorial headings)
        'display-2xl': ['clamp(3rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.75rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.5rem, 2.5vw, 1.875rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },

      // ─── Colors ──────────────────────────────────────────────────────────────
      colors: {
        // ─ Brand Blacks & Grays ─
        obsidian: {
          DEFAULT: '#0A0A0A',
          50: '#F7F7F7',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#666666',
          600: '#3C3C3C', // Graphite
          700: '#2A2A2A',
          800: '#1A1A1A',
          900: '#0A0A0A',
          950: '#050505',
        },

        // ─ Brand Gold (Premium Accent) ─
        gold: {
          DEFAULT: '#C9A84C',
          50: '#FDF9EE',
          100: '#F8EDCB',
          200: '#F0D98B',
          300: '#E8C455',
          400: '#C9A84C',
          500: '#A8842E',
          600: '#876420',
          700: '#664A16',
          800: '#46320E',
          900: '#261B07',
        },

        // ─ Brand Cream (Background) ─
        cream: {
          DEFAULT: '#F5F0E8',
          50: '#FDFCFA',
          100: '#F5F0E8',
          200: '#EBE3D2',
          300: '#DDD3BE',
          400: '#CBBDA4',
          500: '#B5A388',
        },

        // ─ Status Colors ─
        success: {
          DEFAULT: '#16A34A',
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#16A34A',
          700: '#15803D',
        },
        warning: {
          DEFAULT: '#D97706',
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#D97706',
          700: '#B45309',
        },
        error: {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#DC2626',
          700: '#B91C1C',
        },
        info: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#2563EB',
        },
      },

      // ─── Spacing ──────────────────────────────────────────────────────────────
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '72': '18rem',
        '80': '20rem',
        '88': '22rem',
        '96': '24rem',
        '104': '26rem',
        '112': '28rem',
        '120': '30rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '176': '44rem',
        '192': '48rem',
        '208': '52rem',
      },

      // ─── Border Radius ────────────────────────────────────────────────────────
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        DEFAULT: '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },

      // ─── Box Shadows ──────────────────────────────────────────────────────────
      boxShadow: {
        // Luxury subtle shadows
        'xs': '0 1px 2px 0 rgba(10, 10, 10, 0.04)',
        'sm': '0 2px 4px 0 rgba(10, 10, 10, 0.06), 0 1px 2px 0 rgba(10, 10, 10, 0.04)',
        DEFAULT: '0 4px 8px -2px rgba(10, 10, 10, 0.08), 0 2px 4px -2px rgba(10, 10, 10, 0.04)',
        'md': '0 8px 16px -4px rgba(10, 10, 10, 0.1), 0 4px 8px -4px rgba(10, 10, 10, 0.06)',
        'lg': '0 16px 32px -8px rgba(10, 10, 10, 0.12), 0 8px 16px -8px rgba(10, 10, 10, 0.08)',
        'xl': '0 24px 48px -12px rgba(10, 10, 10, 0.16)',
        '2xl': '0 32px 64px -16px rgba(10, 10, 10, 0.2)',
        // Luxury glow effects
        'gold': '0 4px 20px rgba(201, 168, 76, 0.3)',
        'gold-lg': '0 8px 40px rgba(201, 168, 76, 0.4)',
        'inner-subtle': 'inset 0 1px 4px rgba(10, 10, 10, 0.08)',
        // Product card hover
        'card-hover': '0 20px 40px -12px rgba(10, 10, 10, 0.15)',
      },

      // ─── Animation & Transition ───────────────────────────────────────────────
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-out-quart': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      animation: {
        // Entrance animations
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in-down': 'fadeInDown 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        // Looping
        'shimmer': 'shimmer 2s infinite',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        // Skeleton loading
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        skeleton: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },

      // ─── Container ────────────────────────────────────────────────────────────
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          md: '2rem',
          lg: '2.5rem',
          xl: '3rem',
          '2xl': '4rem',
        },
      },

      // ─── Backdrop Blur ────────────────────────────────────────────────────────
      backdropBlur: {
        'xs': '4px',
        'sm': '8px',
        DEFAULT: '12px',
        'lg': '20px',
        'xl': '32px',
        '2xl': '48px',
      },

      // ─── Z-Index ──────────────────────────────────────────────────────────────
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'nav': '1000',
        'drawer': '1100',
        'modal': '1200',
        'toast': '1300',
        'tooltip': '1400',
      },

      // ─── Aspect Ratios ────────────────────────────────────────────────────────
      aspectRatio: {
        'product': '1 / 1',
        'product-wide': '4 / 3',
        'hero': '16 / 9',
        'hero-tall': '3 / 2',
        'banner': '21 / 9',
        'editorial': '2 / 3',
      },

      // ─── Max Width ────────────────────────────────────────────────────────────
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        'content': '1440px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

export default config;
