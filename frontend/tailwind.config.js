/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fortress: {
          base: "#0a0a0f",
          surface: "#13131f",
          surfaceHover: "#191928",
          border: "#1e1e2e",
          borderLight: "#2e2e42",
        },
        saffron: {
          DEFAULT: "#ff9933",
          deep: "#e67e00",
          glow: "rgba(255, 153, 51, 0.15)",
        },
        safety: {
          teal: "#00d4aa",
          gold: "#f1c40f",
          blue: "#3498db",
          crimson: "#c0392b",
        },
        ink: {
          white: "#f0f0f5",
          gray: "#8b8b9e",
          dim: "#5a5a6e",
        },
        // legacy compatibility
        primary: "#13131f",
        accent: "#ff9933",
        danger: "#c0392b",
        success: "#00d4aa",
        warning: "#f1c40f",
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'saffron-glow': '0 0 24px rgba(255, 153, 51, 0.18)',
        'teal-glow': '0 0 24px rgba(0, 212, 170, 0.18)',
        'crimson-glow': '0 0 24px rgba(192, 57, 43, 0.18)',
        'fortress-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      }
    },
  },
  plugins: [],
}
