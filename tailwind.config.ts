import type { Config } from 'tailwindcss'

export default {
  corePlugins: {
    preflight: false,
    container: false,
  },
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{jsx,tsx,html,mdx,md}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
