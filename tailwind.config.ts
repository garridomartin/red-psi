import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edfaff',
          100: '#d7f4fe',
          200: '#b4ebfc',
          300: '#80ddfa',
          400: '#4cc9f0', // Base primary
          DEFAULT: '#4cc9f0',
          hover: '#38b6dd',
          disabled: '#a3e2f5',
          600: '#1b98c3',
          700: '#17799e',
          800: '#18627e',
          900: '#195269',
          950: '#0b3546',
        },
        neutral: {
          50: '#FFFDF5', // Warm neutral background
          100: '#F8F6EB',
          200: '#ECE8DA',
          300: '#D7D1BE',
          400: '#A8A08C',
          500: '#756E5D',
          600: '#5A5445',
          700: '#403B30',
          800: '#27241C',
          900: '#171510',
          950: '#0D0C09',
        },
        brand: {
          accent: '#3A0CA3',
          indigo: '#4361EE',
          dark: '#0B132B',
          surfaceDark: '#111B27',
          cardDark: '#172334',
          borderDark: '#22344D',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.03)',
        card: '0 10px 25px -5px rgba(76, 201, 240, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        hover: '0 20px 30px -10px rgba(76, 201, 240, 0.25), 0 10px 15px -5px rgba(0, 0, 0, 0.06)',
        glow: '0 0 25px rgba(76, 201, 240, 0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
