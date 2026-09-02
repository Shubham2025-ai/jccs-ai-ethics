// FIX: Complete Sovereign Fortress Design System Tailwind Configuration
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // FIX: Sovereign Digital Fortress Color System
        fortress: {
          base: "#0a0a0f", // Deep ink charcoal
          surface: "#13131f", // Warm slate surface
          surfaceHover: "#191928",
          border: "#1e1e2e", // Subtle dark border
          borderLight: "#2e2e42",
        },
        saffron: {
          DEFAULT: "#ff9933", // Primary Sovereign Accent
          deep: "#e67e00", // Deep Gold / Copper
          glow: "rgba(255, 153, 51, 0.15)",
        },
        safety: {
          teal: "#00d4aa", // Safe / Low Risk / Verified
          gold: "#f1c40f", // Medium Risk / Pending
          blue: "#3498db", // Cultural / Regional
          crimson: "#c0392b", // Critical / Violation / Fail
        },
        ink: {
          white: "#f0f0f5", // Primary Text
          gray: "#8b8b9e", // Secondary Muted Text
          dim: "#5a5a6e", // Micro Labels & Borders
        },
        // Legacy compatibility
        primary: "#13131f",
        accent: "#ff9933",
        danger: "#c0392b",
        success: "#00d4aa",
        warning: "#f1c40f",
      },
      fontFamily: {
        // FIX: Strictly defined Typography Hierarchy
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        // FIX: Sovereign Glow & Elevation Shadows
        'saffron-glow': '0 0 24px rgba(255, 153, 51, 0.2)',
        'teal-glow': '0 0 24px rgba(0, 212, 170, 0.2)',
        'crimson-glow': '0 0 24px rgba(192, 57, 43, 0.2)',
        'fortress-card': '0 8px 32px 0 rgba(0, 0, 0, 0.55)',
      },
      animation: {
        // FIX: Custom micro-animations
        'scanline': 'scanline 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateY(200%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        }
      }
    },
  },
  plugins: [],
}
