/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'subject-blue': {
          50: '#E3F2FD',
          100: '#BBDEFB',
          DEFAULT: '#4A90E2',
          400: '#4A90E2',
          600: '#1976D2',
        },
        'variable-purple': {
          50: '#F3E5F5',
          100: '#E1BEE7',
          DEFAULT: '#9B59B6',
          400: '#9B59B6',
          600: '#8E24AA',
        },
        'context-orange': {
          50: '#FFF3E0',
          100: '#FFE0B2',
          DEFAULT: '#E67E22',
          400: '#E67E22',
          600: '#FB8C00',
        },
        'action-green': {
          50: '#E8F5E9',
          100: '#C8E6C9',
          DEFAULT: '#27AE60',
          400: '#27AE60',
          600: '#43A047',
        },
        'system-grey': '#95A5A6',
      },
      backgroundImage: {
        'gradient-mesh-1': 'radial-gradient(at 0% 0%, #4A90E2 0%, transparent 50%), radial-gradient(at 100% 100%, #9B59B6 0%, transparent 50%), radial-gradient(at 50% 50%, #E67E22 0%, transparent 50%)',
        'gradient-mesh-2': 'radial-gradient(at 20% 80%, #27AE60 0%, transparent 50%), radial-gradient(at 80% 20%, #4A90E2 0%, transparent 50%)',
        'gradient-blue': 'linear-gradient(135deg, #4A90E2 0%, #2196F3 100%)',
        'gradient-purple': 'linear-gradient(135deg, #9B59B6 0%, #9C27B0 100%)',
        'gradient-orange': 'linear-gradient(135deg, #E67E22 0%, #FF9800 100%)',
        'gradient-green': 'linear-gradient(135deg, #27AE60 0%, #4CAF50 100%)',
      },
      boxShadow: {
        'blue': '0 10px 30px -5px rgba(74, 144, 226, 0.3)',
        'purple': '0 10px 30px -5px rgba(155, 89, 182, 0.3)',
        'orange': '0 10px 30px -5px rgba(230, 126, 34, 0.3)',
        'green': '0 10px 30px -5px rgba(39, 174, 96, 0.3)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
