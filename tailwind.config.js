/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tonos que cambian con la sección (ruido = oscuro, señal = papel)
        bg: 'rgb(var(--bg) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        // Marca fija (hoja de vida)
        paper: 'rgb(var(--paper) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        void: 'rgb(var(--void) / <alpha-value>)',
        signal: 'rgb(var(--signal) / <alpha-value>)',
        'on-signal': 'rgb(var(--on-signal) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Futura', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        hand: ['var(--font-hand)', 'cursive'],
      },
      letterSpacing: {
        brand: '0.32em',
        wide2: '0.18em',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
