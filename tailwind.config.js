/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slytherin: {
          deep: '#003B2D',
          dark: '#001C16',
          enchanted: '#08734B',
          glow: '#10B981',
          shadow: '#00140f',
          charcoal: '#090D0B'
        },
        gold: {
          antique: '#C9A44C',
          metallic: '#E6C66F',
          bright: '#F9DF88',
          dark: '#8C6F2D',
          burnished: '#9F7D30'
        },
        silver: {
          light: '#E2E8F0',
          pure: '#C6C9C8',
          dark: '#64748B'
        },
        parchment: {
          light: '#F5EEDC',
          DEFAULT: '#D9C99F',
          dark: '#B8A472',
          aged: '#9A8350'
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'Cinzel Decorative', 'serif'],
        medieval: ['MedievalSharp', 'cursive'],
        cormorant: ['Cormorant Garamond', 'serif'],
        pirata: ['Pirata One', 'cursive']
      },
      boxShadow: {
        'emerald-glow': '0 0 25px rgba(8, 115, 75, 0.45), 0 0 50px rgba(0, 59, 45, 0.3)',
        'emerald-inner': 'inset 0 0 30px rgba(8, 115, 75, 0.3)',
        'gold-glow': '0 0 20px rgba(230, 198, 111, 0.45), 0 0 40px rgba(201, 164, 76, 0.25)',
        'gold-inner': 'inset 0 0 20px rgba(230, 198, 111, 0.3)'
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at center, transparent 30%, #001C16 95%)',
        'magical-smoke': 'radial-gradient(circle at 50% 50%, rgba(8, 115, 75, 0.25) 0%, rgba(0, 28, 22, 0.8) 70%, #090D0B 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A44C 0%, #F9DF88 50%, #8C6F2D 100%)'
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'flicker': 'flicker 2.5s infinite alternate'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(8,115,75,0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(16,185,129,0.8))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        flicker: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        }
      }
    },
  },
  plugins: [],
}
