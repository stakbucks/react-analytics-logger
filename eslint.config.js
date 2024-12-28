import pluginReact from "@eslint-react/eslint-plugin";
import pluginReactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

export default tseslint.config({
  files: ["**/*.tsx"],
  extends: [
    importPlugin.flatConfigs.recommended,
    pluginReact.configs.recommended,
  ],
  plugins: {
    "@typescript-eslint": tseslint.plugin,
    "react-hooks": pluginReactHooks,
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    "@typescript-eslint/no-unsafe-argument": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error",
    "no-unused-vars": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        "newlines-between": "always",
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
});
