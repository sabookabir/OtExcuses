/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        toxic: {
          500: '#39FF14', // Neon Green
          900: '#0c2e0b',
        },
        drama: {
          500: '#FF007F', // Hot Pink
        },
        void: '#09090b', // Deep zinc black
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
        'typing': 'blink 1s step-end infinite',
      },
      keyframes: {
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
