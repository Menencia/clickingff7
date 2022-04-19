module.exports = {
  prefix: '',
  content: [
    './src/**/*.{html,ts}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'),require('@tailwindcss/typography')],
};
