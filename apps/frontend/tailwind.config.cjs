/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "pungos-primary": "#2563eb",
        "pungos-primary-700": "#1d4ed8",
        "pungos-accent": "#22c55e",
        "pungos-ink": "#0f172a",
        "pungos-muted": "#f1f5f9",
      },
      boxShadow: { soft: "0 10px 30px rgba(15,23,42,.08)" }
    },
  },
  plugins: [],
};
