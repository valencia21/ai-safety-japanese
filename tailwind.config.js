import { wedgesTW } from "@lemonsqueezy/wedges";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "node_modules/@lemonsqueezy/wedges/dist/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "0rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        beige: "#F9F4EE",
        lwgreen: "#B0CDB2",
        lwgreenlight: "#c1e0c1",
        lwgreendark: "#465246",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sentient: ["Sentient", "sans-serif"],
      },
    },
  },
  plugins: [
    wedgesTW(),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
