export default withNuxt({
  rules: {
    "vue/singleline-html-element-content-newline": "off",
    "vue/max-attributes-per-line": "off",

    "@stylistic/quotes": ["error", "single"],
    "@stylistic/semi": ["error", "never"],
    "@stylistic/comma-dangle": ["error", "never"],

    "vue/html-self-closing": "off",
    "vue/multi-word-component-names": "off",

    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": "off",
  },
});
