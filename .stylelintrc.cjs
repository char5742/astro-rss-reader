module.exports = {
  extends: ["stylelint-config-html/astro", "stylelint-config-recommended"],
  overrides: [
    {
      files: ["*.astro", "**/*.astro"],
      customSyntax: "postcss-html",
    },
  ],
  plugins: ["stylelint-value-no-unknown-custom-properties"],
  rules: {
    "no-empty-source": null,
    "csstools/value-no-unknown-custom-properties": [
      true,
      {
        importFrom: [
          "src/styles/tokens/tokens.css",
          "src/styles/tokens/animation.css",
          "src/styles/tokens/color.css",
          "src/styles/tokens/spacing.css",
          "src/styles/tokens/typography.css",
          "src/styles/tokens/elevation.css",
        ],
      },
    ],
  },
};
