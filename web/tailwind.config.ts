import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          dark: "var(--color-base-dark)",       // Deep earth forest/charcoal (#1e251c)
          cream: "var(--color-cream)",         // Sandy gold / warm safari tan (#e5d096)
          light: "var(--color-cream-light)",   // Warm ivory cream (#fcf9f2)
        },
        accent: {
          amber: "var(--color-accent-amber)",  // Sunset Orange/Amber (#d97706)
          gold: "#d4af37",                    // Premium gold accents
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
