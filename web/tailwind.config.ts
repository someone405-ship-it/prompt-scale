import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0c0c0f",
        surface: "#121218",
        card: "#16161f",
        border: "#2a2740",
        muted: "#8b8b9a",
        violet: {
          DEFAULT: "#8b5cf6",
          soft: "#a78bfa",
          dim: "#6d28d9",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
