/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/index.tsx",
    "./components/template.tsx"
  ],
  theme: {
    colors: {
      "main-gray": "#474747",
      "dusk-blue": "#1D62B4",
      "dusk-purp": "#64559E",
      "mid-gray": "#858585",
      "light-gray": "#D9D9D9",
      "whitish": "#F8F8F8",
      "text-black": "#303030",
      "baby-blue": "#CCE4FF",
      "red": "#951010",
    },
    extend: {},
  },
  plugins: [],
}
