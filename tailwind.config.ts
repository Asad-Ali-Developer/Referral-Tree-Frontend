import type { Config } from 'tailwindcss';

// Deliberate, subject-grounded palette (not the default SaaS-card or
// cream+terracotta look): a registry/ledger feel for a school referral
// tool. One accent (moss) used sparingly; everything else neutral.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FAFAF8',
        ink: '#1C1B19',
        line: '#E4E1DB',
        stone: {
          50: '#FAFAF8',
          100: '#F3F1ED',
          200: '#E4E1DB',
          300: '#CFCAC0',
          400: '#A9A296',
          500: '#847C6E',
          600: '#645D51',
          700: '#4A443B',
          800: '#332E28',
          900: '#1C1B19',
        },
        moss: {
          DEFAULT: '#3F5D4E',
          dark: '#2E463A',
          soft: '#EAF0EC',
        },
        clay: {
          DEFAULT: '#B3441E',
          soft: '#F7E9E2',
        },
        // Semantic aliases so shadcn-style component code reads
        // normally (bg-background, text-foreground, bg-primary, ...)
        background: '#FAFAF8',
        foreground: '#1C1B19',
        border: '#E4E1DB',
        input: '#E4E1DB',
        ring: '#3F5D4E',
        primary: {
          DEFAULT: '#3F5D4E',
          foreground: '#FAFAF8',
        },
        secondary: {
          DEFAULT: '#F3F1ED',
          foreground: '#1C1B19',
        },
        muted: {
          DEFAULT: '#F3F1ED',
          foreground: '#645D51',
        },
        accent: {
          DEFAULT: '#EAF0EC',
          foreground: '#2E463A',
        },
        destructive: {
          DEFAULT: '#B3441E',
          foreground: '#FAFAF8',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#1C1B19',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1C1B19',
        },
      },
      borderRadius: {
        lg: '10px',
        md: '8px',
        sm: '6px',
      },
      fontFamily: {
        sans: ['var(--font-plex)', 'ui-sans-serif', 'system-ui'],
        serif: ['var(--font-source-serif)', 'ui-serif', 'Georgia'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
