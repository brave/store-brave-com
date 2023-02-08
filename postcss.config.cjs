const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const theme = require('@brave/leo/postcss/theme');

module.exports = {
  plugins: [
    // Some plugins need to run before Tailwind
    theme({ useGlobal: true }),

    tailwindcss,

    // But others, like autoprefixer, need to run after

    autoprefixer
  ]
};
