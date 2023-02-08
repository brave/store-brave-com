module.exports = {
  darkMode: ['class', `[data-theme="dark"]`],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  presets: [require('@brave/leo/build/tailwind')],
  theme: {},
  plugins: []
};
