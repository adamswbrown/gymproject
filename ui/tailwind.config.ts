import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        joes: {
          dark: "#2C2C2C",
          muted: "#6B6B6B",
          background: "#F5F5F0",
          surface: "#FFFFFF",
          text: "#333333",
          mutedText: "#666666",
          accent: "#C84A3A",
          accentMuted: "#A03A2D",
          border: "#D0D0D0",
        },
      },
      fontFamily: {
        heading: ["system-ui", "-apple-system", "sans-serif"],
        body: ["system-ui", "-apple-system", "sans-serif"],
        oswald: ["system-ui", "-apple-system", "sans-serif"],
        inter: ["system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "3px",
        md: "4px",
      },
      boxShadow: {
        subtle: "0 2px 4px rgba(0,0,0,0.1)",
        none: "none",
      },
      letterSpacing: {
        normal: "0em",
        slight: "0.02em",
      },
      transitionTimingFunction: {
        ease: "ease",
      },
    },
  },
  plugins: [],
} satisfies Config;
