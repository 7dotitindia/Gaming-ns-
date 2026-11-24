export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: 'rgb(var(--c-ink) / <alpha-value>)', graphite: 'rgb(var(--c-graphite) / <alpha-value>)', raise: 'rgb(var(--c-raise) / <alpha-value>)', line: 'rgb(var(--c-line) / <alpha-value>)', warm: 'rgb(var(--c-warm) / <alpha-value>)', mute: 'rgb(var(--c-mute) / <alpha-value>)', accent: 'rgb(var(--c-accent) / <alpha-value>)', coral: 'rgb(var(--c-coral) / <alpha-value>)', mint: 'rgb(var(--c-mint) / <alpha-value>)', sky: 'rgb(var(--c-sky) / <alpha-value>)' },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { DEFAULT: '8px', lg: '12px', xl: '16px' },
      transitionDuration: { DEFAULT: '200ms' },
    },
  },
  plugins: [],
}
