// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    // 🔥 Отключаем лишнюю духоту
    "vue/singleline-html-element-content-newline": "off",
    "vue/max-attributes-per-line": "off",

    // 🧼 Стиль кода
    "@stylistic/quotes": ["error", "single"],
    "@stylistic/semi": ["error", "never"],
    "@stylistic/comma-dangle": ["error", "never"],

    // 💡 Vue удобство
    "vue/html-self-closing": "off",
    "vue/multi-word-component-names": "off",

    // 🧠 Можно ослабить строгость
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": "off",
  },
});
