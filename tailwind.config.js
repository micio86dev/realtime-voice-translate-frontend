/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#c52a1b",
          100: "#c52a1b",
          200: "#c52a1b",
          300: "#c52a1b",
          400: "#c52a1b",
          500: "#c52a1b",
          600: "#d52a2b",
          700: "#d52a2b",
          800: "#d52a2b",
          900: "#d52a2b",
          950: "#d52a2b",
        },
        danger: colors.red,
        info: colors.blue,
        success: colors.green,
        warning: colors.orange,
        secondary: colors.gray,
      },
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class",
};
