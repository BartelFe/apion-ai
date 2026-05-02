/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F3EE',
        ink: '#0A0A0B',
        trace: '#D4571B',
        steel: '#6E6E70',
        mist: '#E5E1D8',
        abyss: '#08070A',
        ember: '#1A1408',
        'paper-dim': '#1F1D1A',
      },
      fontFamily: {
        display: ['Newsreader', 'Iowan Old Style', 'Charter', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        'mono-wide': '0.18em',
        'logo': '0.4em',
      },
    },
  },
  plugins: [],
};
