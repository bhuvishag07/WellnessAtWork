/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#111111',
          blue: '#5F70B8',
          pink: '#E58FA9',
        },
        paper: {
          DEFAULT: '#F6EFDD',
          card: '#FFFFFF',
          deep: '#F2D98B',
        },
        butter: '#F2D98B',
        rose: '#E58FA9',
        sage: '#A8D5BA',
        peri: '#B9C4E8',
        blush: '#EFCAD4',
        indigo: '#5F70B8',
        sticky: '#F3E6B8',
        muted: '#6B6478',
        // Compatibility aliases for legacy Riso/Lilac palettes
        plum: {
          DEFAULT: '#111111',
          dark: '#111111',
          secondary: '#6B6478',
          deep: '#111111',
          muted: '#6B6478',
          light: '#F6EFDD',
        },
        sun: '#F2D98B',
        lilac: {
          50: '#FFFFFF',
          100: '#F6EFDD',
          200: '#F2D98B',
          300: '#EFCAD4',
          400: '#B9C4E8',
          500: '#A8D5BA',
          600: '#5F70B8',
          700: '#5F70B8',
          800: '#111111',
          900: '#111111',
        },
        surface: {
          canvas: '#F6EFDD',
          glass: '#FFFFFF',
          glassTint: '#F2D98B',
          glassElevated: '#FFFFFF',
          glassBorder: '#111111',
          glassHighlight: '#FFFFFF',
        }
      },
      boxShadow: {
        'sticker': '6px 6px 0 #111111',
        'sticker-sm': '3px 3px 0 #111111',
        'sticker-lg': '8px 8px 0 #111111',
        'sticker-rose': '5px 5px 0 #E58FA9',
        'sticker-hover': '5px 5px 0 #111111',
        // Legacy mapping to sticker shadows
        'glass': '6px 6px 0 #111111',
        'glass-hover': '8px 8px 0 #111111',
        'glass-glow': '3px 3px 0 #E58FA9',
        'glass-inset': 'none',
        'inner-light': 'none',
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        'md': '2px',
        'lg': '2px',
        'xl': '2px',
        '2xl': '2px',
        'xl-plus': '2px',
        '2xl-plus': '2px',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'float-reverse': 'floatReverse 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-1deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
