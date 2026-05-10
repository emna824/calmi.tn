/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        calm: {
          violet: "#7C3AED",
          violetDark: "#5B21B6",
          lavender: "#EDE9FE",
          mist: "#F8FAFC",
          ink: "#1E293B",
          muted: "#64748B",
          line: "#E2E8F0"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(91, 33, 182, 0.12)",
        card: "0 12px 30px rgba(30, 41, 59, 0.07)"
      }
    }
  },
  plugins: []
};
