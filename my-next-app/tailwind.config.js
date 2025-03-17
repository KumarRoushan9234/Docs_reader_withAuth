/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightBg: "#f8f9fa",
        cardBg: "#ffffff",
        textDark: "#333",
      },
    },
  },
  plugins: [require("daisyui")],
};
