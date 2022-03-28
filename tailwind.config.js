module.exports = {
  purge: {
    content: ["./src/**/*.{html,ts}"],
    options: {
      safelist: ["bg-blue-400", "bg-red-400", "bg-green-400"]
    }
  },
  darkMode: false,
  content: [],
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled']
    }
  },
  plugins: [],
};
