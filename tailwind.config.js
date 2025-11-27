/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          maroon: "#6e0b0b",
          accent: "#c43c3c"
        }
      }
    }
  },
  plugins: []
}