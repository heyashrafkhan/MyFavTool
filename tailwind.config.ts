import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d5d9e2",
          300: "#b1b9c9",
          400: "#8792ab",
          500: "#687490",
          600: "#535d76",
          700: "#444b60",
          800: "#3b4151",
          900: "#343946",
          950: "#23262f",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16,24,40,0.04), 0 1px 3px 0 rgba(16,24,40,0.06)",
        "card-hover":
          "0 12px 24px -8px rgba(16,24,40,0.12), 0 4px 8px -4px rgba(16,24,40,0.06)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
