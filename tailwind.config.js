/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        dark: {
          bg: '#0e1219',
          canvas: '#11151e',
          card: '#161b25',
          cardLight: '#1c2230',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.05)',
          pill: '#1e2635',
          pillHover: '#252f42',
          textMuted: '#94a3b8',
          textDim: '#64748b'
        },
        brand: {
          primary: '#0369A1',     // Sky 700
          primaryHover: '#075985',
          secondary: '#0EA5E9',   // Sky 500
          accent: '#10B981',      // Emerald 500
          accentHover: '#059669',
          destructive: '#EF4444', // Red 500
          warning: '#F59E0B',     // Amber 500
          canvas: '#0E1219',
          card: '#161B25',
          border: 'rgba(255, 255, 255, 0.08)',
          muted: '#1E2635',
          foreground: '#F8FAFC',
        }
      },
      boxShadow: {
        'card-soft': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-elevated': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      }
    },
  },
  plugins: [],
}
