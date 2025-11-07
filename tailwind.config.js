/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0066CC',
          600: '#0052a3',
          700: '#003d7a',
          800: '#002952',
          900: '#001429',
        },
        secondary: {
          DEFAULT: '#00A86B',
          50: '#e6faf3',
          100: '#b3f0d8',
          200: '#80e6bd',
          300: '#4ddca2',
          400: '#1ad287',
          500: '#00A86B',
          600: '#008656',
          700: '#006441',
          800: '#00422c',
          900: '#002017',
        },
        accent: {
          DEFAULT: '#FFB800',
          50: '#fff8e6',
          100: '#ffebb3',
          200: '#ffde80',
          300: '#ffd14d',
          400: '#ffc41a',
          500: '#FFB800',
          600: '#cc9300',
          700: '#996e00',
          800: '#664900',
          900: '#332400',
        },
        danger: {
          DEFAULT: '#DC3545',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0066CC 0%, #00A86B 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FFB800 0%, #ff9500 100%)',
      },
      boxShadow: {
        'default': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'hover': '0 8px 16px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
