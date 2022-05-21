module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
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
