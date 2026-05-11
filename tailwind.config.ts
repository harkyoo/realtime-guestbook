import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#fff7df",
        cork: "#c88f5a",
        ink: "#332b24",
        blush: "#ffe9dd",
      },
      boxShadow: {
        note: "0 14px 30px rgba(97, 70, 35, 0.18)",
        soft: "0 18px 60px rgba(64, 45, 28, 0.14)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
