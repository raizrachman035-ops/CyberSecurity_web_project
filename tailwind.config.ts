import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#111317",
        surface: "#111317",
        "surface-dim": "#111317",
        "surface-bright": "#37393d",
        "surface-container-lowest": "#0c0e11",
        "surface-container-low": "#1a1c1f",
        "surface-container": "#1e2023",
        "surface-container-high": "#282a2d",
        "surface-container-highest": "#333538",
        "surface-variant": "#333538",
        "on-surface": "#e2e2e6",
        "on-surface-variant": "#b9cacb",
        "inverse-surface": "#e2e2e6",
        "inverse-on-surface": "#2f3034",
        outline: "#849495",
        "outline-variant": "#3a494b",
        "surface-tint": "#00dce6",

        primary: "#e0fdff",
        "on-primary": "#00373a",
        "primary-container": "#00f2fe",
        "on-primary-container": "#006a70",
        "inverse-primary": "#00696f",
        "primary-fixed": "#6ff6ff",
        "primary-fixed-dim": "#00dce6",
        "on-primary-fixed": "#002022",
        "on-primary-fixed-variant": "#004f53",

        secondary: "#4edea3",
        "on-secondary": "#003824",
        "secondary-container": "#00a572",
        "on-secondary-container": "#00311f",
        "secondary-fixed": "#6ffbbe",
        "secondary-fixed-dim": "#4edea3",
        "on-secondary-fixed": "#002113",
        "on-secondary-fixed-variant": "#005236",

        tertiary: "#f6f7fc",
        "on-tertiary": "#2d3134",
        "tertiary-container": "#d9dbdf",
        "on-tertiary-container": "#5d6063",
        "tertiary-fixed": "#e0e2e6",
        "tertiary-fixed-dim": "#c4c7ca",
        "on-tertiary-fixed": "#191c1f",
        "on-tertiary-fixed-variant": "#44474a",

        error: "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
      },
      spacing: {
        margin: "1.25rem",
        "margin-tablet": "2.5rem",
        "margin-desktop": "4rem",
        gutter: "1.5rem",
        "gutter-desktop": "2rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        headline: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        telemetry: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 242, 254, 0.25)",
        "glow-lg": "0 0 35px rgba(0, 242, 254, 0.4)",
        "glow-secondary": "0 0 20px rgba(78, 222, 163, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

