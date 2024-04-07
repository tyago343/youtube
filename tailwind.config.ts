import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontSize: {
      lg: "2rem",
    },
    extend: {
      borderRadius: {
        lg: "30px",
      },
    },
  },
  plugins: [],
} satisfies Config;
