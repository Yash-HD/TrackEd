/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // This enables our dark mode toggle
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: {
          light: '#1E293B', // For light mode sidebars
          dark: '#0F172A',  // For dark mode sidebars/backgrounds
          lightdarkish: '#2c4173',
        },
        background: {
          light: '#F8FAFC',
          dark: '#0F172A',
        },
        accent: {
          cyan: '#22D3EE',
          green: '#10B981',
          red: '#EF4444',
          amber: '#F59E0B',
        },
        'text-light': '#111827',
        'text-dark': '#F9FAFB',
        // --- CUSTOM PALETTE ---
        onyx: {
          50: '#f2f0f4',
          100: '#e4e2e9',
          200: '#cac5d3',
          300: '#afa8bd',
          400: '#948ba7',
          500: '#7a6e91',
          600: '#615874',
          700: '#494257',
          800: '#312c3a',
          900: '#18161d',
          950: '#110f14'
        },
        platinum: {
          50: '#f3f1f2',
          100: '#e8e3e5',
          200: '#d1c7ca',
          300: '#b9acb0',
          400: '#a29096',
          500: '#8b747c',
          600: '#6f5d63',
          700: '#53464a',
          800: '#382e31',
          900: '#1c1719',
          950: '#131011'
        },
        'dark-teal': {
          50: '#e8fbfc',
          100: '#d1f8fa',
          200: '#a4f0f4',
          300: '#76e9ef',
          400: '#48e2ea',
          500: '#1bdae4',
          600: '#15afb7',
          700: '#108389',
          800: '#0b575b',
          900: '#052c2e',
          950: '#041f20'
        },
        'stormy-teal': {
          50: '#edf6f8',
          100: '#dbeef0',
          200: '#b6dde2',
          300: '#92ccd3',
          400: '#6dbbc5',
          500: '#49aab6',
          600: '#3a8892',
          700: '#2c666d',
          800: '#1d4449',
          900: '#0f2224',
          950: '#0a181a'
        },
        'frosted-blue': {
          50: '#e9f8fc',
          100: '#d2f1f9',
          200: '#a5e3f3',
          300: '#78d5ed',
          400: '#4bc8e7',
          500: '#1fbae0',
          600: '#1895b4',
          700: '#126f87',
          800: '#0c4a5a',
          900: '#06252d',
          950: '#041a1f'
        }
      },
    },
  },
  plugins: [],
}