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
        'xs': "550px",
        'xxs': "450px",
        'xxxs': "350px",
        'xxxxs': "250px",
        'xxxxxs': "150px",
      },
    },
    extend: {
      screens: {
        'standalone': { 'raw': "(display-mode:standalone) " },
        'max-xm': { 'raw': 'not all and (min-width: 475px)' },
        'max-sm': { 'raw': 'not all and (min-width: 640px)' },
        'max-md': { 'raw': 'not all and (min-width: 768px)' },
        'max-lg': { 'raw': 'not all and (min-width: 1024px)' },
        'max-xl': { 'raw': 'not all and (min-width: 1280px)' },
        'max-2xl': { 'raw': 'not all and (min-width: 1536px)' },
        'max-2xl': { 'raw': 'not all and (min-width: 1920px)' },
        'Mobile': { 'raw': 'only screen and (hover: none) and (pointer: coarse)' },
        'Desktop': { 'raw': ' all and (hover: hover) and (pointer: fine)' },
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
