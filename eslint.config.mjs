import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Add prettier integration properly
  eslintConfigPrettier,
  {
    rules: {
      // Additional custom rules can go here
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  }
];

export default eslintConfig;
