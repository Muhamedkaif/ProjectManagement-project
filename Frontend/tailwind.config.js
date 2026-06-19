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
          DEFAULT: '#4f46e5',
          hover: '#4338ca',
          light: '#eef2ff',
        },
        secondary: '#6366f1',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        text: {
          main: '#111827',
          sub: '#4b5563',
          muted: '#9ca3af',
        },
        bg: {
          main: '#ffffff',
          sub: '#f9fafb',
          accent: '#f3f4f6',
        },
        border: {
          DEFAULT: '#e5e7eb',
          hover: '#d1d5db',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      boxShadow: {
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      spacing: {
        'sidebar-w': '260px',
        'sidebar-c': '80px',
        'navbar-h': '64px',
      }
    },
  },
  plugins: [],
}
