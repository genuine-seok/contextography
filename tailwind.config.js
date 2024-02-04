/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // TODO: 사용 컬러 수정
      colors: {
        black: "#000000",
        chacol: "#22212B",
        lightGray: "#E5E5E5",
        gray: "#999999",
        vermilion: "#E24217",
        point: "#6080DC",
        test: "#48475D",
      },
      keyframes: {
        fontWeight: {
          "0%": {
            "font-weight": 100,
          },
          "50%": {
            "font-weight": 900,
          },
          "100%": {
            "font-weight": 100,
          },
        },
      },
      animation: {
        fontLoop: "fontWeight 6s infinite both",
      },
    },
  },
  plugins: [],
};
