/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A2E",
        accent: "#6C63FF",
        danger: "#E94560",
        success: "#00B894",
        warning: "#FDCB6E",
      }
    },
  },
  plugins: [],
}
