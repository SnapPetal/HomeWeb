module.exports = {
  content: [
    './public/**/*.{html,js}',
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}'
  ],
  theme: {
    extend: {
      inset: {
        '100': '100%',
      },

      padding: {
        '120': '120px',
      }
    },
  },
  variants: {},
  plugins: [],
}
