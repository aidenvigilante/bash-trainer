/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hacker: {
          darkest: '#0a0d0f',
          darker: '#0f1418',
          card: '#141b21',
          border: '#1f2b34',
          accent: '#00ff66',
          cyan: '#00e5ff',
          dim: '#8599a6',
          warning: '#ffb300',
          danger: '#ff3366',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      }
    },
  },
  plugins: [],
}
