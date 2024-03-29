/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#ff225b",
      },
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',

      'tablet': {'min':'520px','max':'1001px'},
      '580-861': {'min':'580px','max':'861px'},
      '860-1001': {'min':'860px','max':'1001px'},

      'mobile': {'max':'521px'},
      'max-580': {'max':'580px'},
      'max-680': {'max':'680px'},
      'max-900': {'max':'900px'},
      'max-1000': {'max':'1000px'},

      'min-500': {'min':'500px'},
      'min-680': {'min':'680px'},
      'min-1001': {'min':'1001px'},

      // => @media (min-width: 1536px) { ... }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
};
