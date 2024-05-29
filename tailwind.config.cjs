module.exports = {
  darkMode: ['class', `[data-theme="dark"]`],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  presets: [require('@brave/leo/tokens/tailwind')],
  theme: {
    screens: {
      xxs: '360px',
      xs: '440px',
      sm: '560px',
      'md-sm': '641px',
      md: '821px',
      lg: '1141px',
      xl: '1440px'
    },
    opacity: {
      0: '0',
      10: '.1',
      15: '.15',
      20: '.2',
      25: '.25',
      30: '.3',
      35: '.35',
      40: '.4',
      45: '.45',
      50: '.5',
      55: '.55',
      60: '.6',
      65: '.65',
      70: '.7',
      75: '.75',
      80: '.8',
      85: '.85',
      90: '.9',
      95: '.95',
      100: '1'
    }
  },
  plugins: []
};
