/** @type {import('tailwindcss').Config} */
const config = {
   content: ["./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         fontFamily: {
            sans: ["Inter", "sans-serif"],
         },
      },
   },
   plugins: [require("daisyui")],
   daisyui: {
      themes: [
         // "lemonade",
         // "forest",
         {
            mytheme: {
               "primary": "#6366f1",
               "secondary": "#fb7185",
               "accent": "#37CDBE",
               "neutral": "#3D4451",
               "base-100": "#FFFFFF",
               "info": "#3ABFF8",
               "success": "#36D399",
               "warning": "#FBBD23",
               "error": "#F87272",
            },
         },
      ],
   },
};

module.exports = config;
