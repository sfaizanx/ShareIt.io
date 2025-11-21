/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enable dark mode via class
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        bg: "var(--color-bg)",
        card: "var(--color-card)",
        border: "var(--color-border)",
      },
    },
  },
  plugins: [],
};
