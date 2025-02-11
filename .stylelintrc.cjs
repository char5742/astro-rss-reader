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
        importFrom: ["src/styles/tokens/tokens.css"],
      },
    ],
  },
};
