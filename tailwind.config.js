/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        'ink-muted': '#5C5F66',
        accent: '#CFFF04',
        'accent-alt': '#FF3B1F',
        surface: '#FFFFFF',
        'surface-dark': '#0A0A0A',
        'surface-alt': '#F2F2F2',
        success: '#1E7B34',
        error: '#C81E1E',
        border: '#E1E1E1',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
        24: '96px',
      },
      fontFamily: {
        display: ['Archivo', 'Arial Narrow', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
