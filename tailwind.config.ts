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
        horror: {
          orange: "#FF6B00",
          "orange-light": "#FF8C00",
          "orange-dark": "#CC5500",
          "orange-dim": "#7A3300",
          red: "#8B0000",
          "red-dark": "#4A0000",
          black: "#0A0A0A",
          card: "#111111",
          "card-hover": "#161616",
          border: "rgba(255,107,0,0.18)",
          "text-primary": "#E8E8E8",
          "text-secondary": "#9CA3AF",
          "text-muted": "#6B7280",
        },
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "fog-slow": "fogDrift 22s ease-in-out infinite",
        "fog-medium": "fogDrift2 28s ease-in-out infinite",
        "fog-fast": "fogDrift 16s ease-in-out infinite reverse",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "flicker": "flicker 5s linear infinite",
        "float": "float 7s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "spin-slow": "spin 25s linear infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "ember": "ember 4s ease-in-out infinite",
        "marquee": "marquee 45s linear infinite",
      },
      keyframes: {
        fogDrift: {
          "0%, 100%": { transform: "translateX(-6%) scaleY(1)", opacity: "0.55" },
          "33%": { transform: "translateX(4%) scaleY(1.08)", opacity: "0.75" },
          "66%": { transform: "translateX(-3%) scaleY(0.94)", opacity: "0.5" },
        },
        fogDrift2: {
          "0%, 100%": { transform: "translateX(5%) scaleY(1)", opacity: "0.45" },
          "50%": { transform: "translateX(-6%) scaleY(1.15)", opacity: "0.7" },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(255,107,0,0.35), 0 0 40px rgba(255,107,0,0.12)",
          },
          "50%": {
            boxShadow:
              "0 0 45px rgba(255,107,0,0.65), 0 0 90px rgba(255,107,0,0.28)",
          },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "4%": { opacity: "0.85" },
          "8%": { opacity: "1" },
          "72%": { opacity: "0.92" },
          "74%": { opacity: "0.7" },
          "76%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        fadeUp: {
          "0%": { transform: "translateY(28px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        ember: {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: "0.8" },
          "50%": { transform: "translateY(-20px) scale(1.2)", opacity: "0.4" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      backgroundImage: {
        "orange-radial":
          "radial-gradient(ellipse at center, rgba(255,107,0,0.25) 0%, transparent 70%)",
        "card-gradient":
          "linear-gradient(135deg, #111111 0%, #161616 100%)",
      },
      boxShadow: {
        "orange-sm": "0 0 15px rgba(255,107,0,0.3)",
        "orange-md": "0 0 30px rgba(255,107,0,0.45)",
        "orange-lg": "0 0 60px rgba(255,107,0,0.35), 0 0 120px rgba(255,107,0,0.15)",
        "card": "0 4px 24px rgba(0,0,0,0.6)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.8), 0 0 30px rgba(255,107,0,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
