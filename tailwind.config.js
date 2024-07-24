/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        darkBlue:"#102F47",
        red:"#C53A33",
        lightOrange:"#E78530",
        lightYellow:"#F3C15F",
        lightPeach:"#E9E2BC",
        lightGray:"#F2F0EF"
      },
      fontFamily:{
        poppins:"Poppins, sans-serif"
      }
    },
  },
  plugins: [],
}