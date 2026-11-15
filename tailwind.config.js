/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm off-white / ivory primary background
        ivory: "#FDFBF7",
        // White secondary background
        white: "#FFFFFF",
        // Deep charcoal main text
        charcoal: "#1A1A1A",
        // Dark charcoal near-black for dark sections
        "charcoal-dark": "#0F0F0F",
        // Muted grey secondary text
        muted: "#6B7280",
        // Sophisticated forest green / olive accent (used sparingly)
        forest: "#3F6212",
        "forest-dark": "#2D4A19",
        "forest-light": "#E7EFDA",
        // Soft neutral borders
        border: "#E7E5E4",
        // Subtle neutral surfaces
        surface: "#F5F5F0",
        // Dark mode surfaces
        "dark-surface": "#141414",
        "dark-border": "#2A2A2A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["3.75rem", { lineHeight: "1.05", fontWeight: "700", letterSpacing: "-0.02em" }],
        h2: ["3rem", { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.01em" }],
        h3: ["2.25rem", { lineHeight: "1.2", fontWeight: "600" }],
        h4: ["1.75rem", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.7" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
        180: "45rem",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
