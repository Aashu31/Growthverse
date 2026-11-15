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
        // Primary Dark — Espresso Brown palette
        espresso: "#24140E",
        "deep-coffee": "#321B12",
        "dark-mocha": "#40251A",
        "rich-brown": "#2A1610",

        // Primary Light — Warm Cream palette
        "warm-cream": "#F6EBDD",
        "soft-ivory": "#FFF8ED",
        "sand-beige": "#E8D4BD",
        "pale-linen": "#FAF3E8",

        // Accent — Champagne Gold palette
        champagne: "#E8B875",
        caramel: "#B97843",
        "muted-bronze": "#8C5A35",
        "light-gold": "#F0C98D",

        // Supporting
        "warm-grey": "#B8A99A",
        "dark-text": "#281810",
        "light-text": "#FFF4E6",

        // Surface & Border tokens
        "gv-border": "#D4C4B0",
        "gv-border-dark": "#4A3228",
        "gv-surface": "#F2E6D6",
        "gv-surface-dark": "#1E110B",

        // Status colors (preserved for dashboard)
        "status-success": "#4A7C59",
        "status-warning": "#C4882F",
        "status-error": "#B33A3A",
        "status-info": "#5A7CA8",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": ["5rem", { lineHeight: "1.05", fontWeight: "700", letterSpacing: "-0.02em" }],
        "display-lg": ["4rem", { lineHeight: "1.08", fontWeight: "700", letterSpacing: "-0.02em" }],
        h1: ["3.5rem", { lineHeight: "1.08", fontWeight: "700", letterSpacing: "-0.02em" }],
        h2: ["2.75rem", { lineHeight: "1.12", fontWeight: "700", letterSpacing: "-0.01em" }],
        h3: ["2rem", { lineHeight: "1.2", fontWeight: "600" }],
        h4: ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        h5: ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.7" }],
        small: ["0.875rem", { lineHeight: "1.6" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        144: "36rem",
        180: "45rem",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "glow-gold": "0 0 30px rgba(232, 184, 117, 0.15)",
        "glow-gold-lg": "0 0 60px rgba(232, 184, 117, 0.2)",
        "card-warm": "0 4px 24px rgba(36, 20, 14, 0.08)",
        "card-warm-lg": "0 12px 40px rgba(36, 20, 14, 0.12)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.12)",
        "glass-lg": "0 16px 48px rgba(0, 0, 0, 0.16)",
      },
      backgroundImage: {
        "gradient-warm": "linear-gradient(135deg, #24140E 0%, #40251A 50%, #321B12 100%)",
        "gradient-cream": "linear-gradient(180deg, #FFF8ED 0%, #F6EBDD 100%)",
        "gradient-gold": "linear-gradient(135deg, #E8B875 0%, #B97843 100%)",
        "gradient-mocha": "linear-gradient(180deg, #321B12 0%, #24140E 100%)",
        "gradient-hero": "radial-gradient(ellipse at 30% 50%, rgba(232, 184, 117, 0.08) 0%, transparent 60%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
        "orbit": "orbit 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
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
        glowPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
