module.exports = {
  purge: [],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        "25vh": "25vh",
        "50vh": "50vh",
        "75vh": "75vh",
      },
      gridTemplateColumns: {
        6: "0.18fr 4fr 0.6fr 0.25fr 0.6fr 0.3fr",
      },
      borderRadius: {
        xl: "1.5rem",
      },
      minHeight: {
        "50vh": "50vh",
        "75vh": "75vh",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("tailwindcss-children"),
    require("@tailwindcss/line-clamp"),
  ],
};
