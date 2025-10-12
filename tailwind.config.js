/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // MVP1 Brand Palette
        brand: '#00E18D',
        bg: '#0B0F14',
        panel: '#11161D',
        muted: '#1A222C',
        text: '#E8EEF5',
        'text-muted': '#A9B4C0',
        accent: '#4DD2FF',
        danger: '#FF5C5C',
        success: '#00E18D',
        warning: '#FFB800',
        
        // Semantic colors
        primary: {
          DEFAULT: '#00E18D',
          foreground: '#0B0F14',
        },
        secondary: {
          DEFAULT: '#1A222C',
          foreground: '#E8EEF5',
        },
        destructive: {
          DEFAULT: '#FF5C5C',
          foreground: '#E8EEF5',
        },
        muted: {
          DEFAULT: '#1A222C',
          foreground: '#A9B4C0',
        },
        accent: {
          DEFAULT: '#4DD2FF',
          foreground: '#0B0F14',
        },
        background: '#0B0F14',
        foreground: '#E8EEF5',
        card: {
          DEFAULT: '#11161D',
          foreground: '#E8EEF5',
        },
        border: '#1A222C',
        input: '#1A222C',
        ring: '#00E18D',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
};