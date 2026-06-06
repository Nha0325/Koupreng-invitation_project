/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Kantumruy Pro", "Inter", "system-ui", "sans-serif"],
        display: ["Moul", "Kantumruy Pro", "serif"],
      },
      colors: {
        koupreng: {
          cream: "#fbf7f0",
          paper: "#fffdf9",
          gold: "#b0926a",
          amber: "#d4af37",
          ink: "#302a27",
          plum: "#3d2461",
          navy: "#112533",
        },
      },
      boxShadow: {
        soft: "0 18px 60px rgba(82, 57, 25, 0.08)",
        panel: "0 10px 34px rgba(58, 43, 20, 0.08)",
      },
    },
  },
  plugins: [],
};
