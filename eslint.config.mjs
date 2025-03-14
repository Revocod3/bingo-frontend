import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Add prettier integration
  ...compat.extends("prettier"),
  {
    rules: {
      // Additional custom rules can go here
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  }
];

export default eslintConfig;
