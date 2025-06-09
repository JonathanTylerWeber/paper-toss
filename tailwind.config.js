/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: { "screen-d": "100dvw" },
      height: { "screen-d": "100dvh" },
    },
  },
  plugins: [],
};
