import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    animation: {
      "move-bounce": "move-bounce 0.3s forwards", // Use 'forwards' to retain the last keyframe state
    },
    keyframes: {
      "move-bounce": {
        "0%": {
          transform: "translate(0, 0)", // Start at original position
        },
        "50%": {
          transform: "translate(-10px, 10px)", // Move down and to the left
        },
        "100%": {
          transform: "translate(-5px, 5px)", // End at near original with slight offset
        },
      },
    },
  },
  plugins: [],
};
export default config;
