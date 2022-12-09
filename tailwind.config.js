// @type { import('tailwindcss').Config }
module.exports = {

  darkMode: 'class',


  content: [

    "./Component/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./Layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue': '#1fb6ff',
        'purple': '#76fbef',
        'pink': '#ff49db',
        'orange': '#ff7849',
        'green': '#13ce66',
        'yellow': '#ffc82c',
        'gray-dark': '#273444',
        'gray': '#8492a6',
        'gray-light': '#d3dce6',
      },
    },
    extend: {
      screens: {
        '3xl': '1575px',
        '4xl': '1900px',
        'xs': "550px"
      },
    },

  },
  plugins: [

    require("daisyui"),
    // require('flowbite/plugin'),
    require('tailwind-scrollbar-hide'),
    require('prettier-plugin-tailwindcss')
  ],

  daisyui: {
    themes: ["light", "dark"],
  },


}
