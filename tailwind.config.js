/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'Apple Color Emoji',
          'Segoe UI Emoji',
        ],
      },
      colors: {
        alg: '#2563EB',
        phys: '#16A34A',
        fds: '#A21CAF',
        maths: '#EA580C',
        exam: '#DC2626',
        personal: '#EC4899',
        holiday: '#0EA5E9',
      },
      boxShadow: {
        soft: '0 18px 60px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
}

