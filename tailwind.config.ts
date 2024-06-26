import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        lg: "2rem",
      },
      width: {
        "18": "4.5rem"
      },
      borderRadius: {
        lg: "30px",
      },
      colors: {
        dark: {
          950: "#0f0f0f",
          900: "rgb(18, 18, 18)",
          850: "rgb(48, 48, 48)",
          800: "rgba(255, 255, 255, 0.08)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
