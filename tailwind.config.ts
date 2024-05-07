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
      colors: {
        "c-blue": { 100: "#1B9CFC", 200: "#3742FA" },
      },
      animation: {
        "move-bounce-enter": "move-bounce-enter 0.3s forwards", // Use 'forwards' to retain the last keyframe state
        "move-bounce-leave": "move-bounce-leave 0.2s forwards", // Use 'forwards' to retain the last keyframe state
      },
      keyframes: {
        "move-bounce-enter": {
          "0%": {
            transform: "translate(0, 0)", // Start at original position
          },
          "40%": {
            transform: "translate(-10px, 10px)", // Move down and to the left
          },
          "70%": {
            transform: "translate(-6px, 6px)", // Move down and to the left
          },
          "100%": {
            transform: "translate(-8px, 8px)", // End at near original with slight offset
          },
        },
        "move-bounce-leave": {
          "0%": {
            transform: "translate(-8px, 8px)", // Start at original position
          },
          "70%": {
            transform: "translate(2px, -2px)", // Move down and to the left
          },
          "100%": {
            transform: "translate(0px, 0px)", // End at near original with slight offset
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
