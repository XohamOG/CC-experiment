/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        wiggle: {
          "0%": {
            transform: "translateY(0) rotate(0deg) scale(1)",
          },
          "50%": {
            transform: "translateY(-1px) rotate(-0.5deg) scale(0.98)",
          },
          "100%": {
            transform: "translateY(0) rotate(0deg) scale(1)",
          },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-20%)",
          },
          "100%": {
            transform: "translateX(20%)",
          },
        },
        floatY: {
          "0%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-4px)",
          },
          "100%": {
            transform: "translateY(0px)",
          },
        },
        popIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(8px) scale(0.98) rotate(-0.5deg)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1) rotate(0deg)",
          },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        textFloat: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        wiggle: "wiggle 200ms ease-in-out",
        shimmer: "shimmer 1400ms cubic-bezier(0.65, 0, 0.35, 1) infinite",
        "float-slow": "floatY 6s ease-in-out infinite",
        "pop-in": "popIn 700ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in-up": "fadeInUp 520ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "text-float-slow": "textFloat 5s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["Geist", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
        serif: ["Bricolage Grotesque", "serif"],
      },
    },
  },
  plugins: [],
}