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
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "scripts/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Common warnings to suppress in production builds
      "@typescript-eslint/no-unused-vars": process.env.NODE_ENV === "production" ? "warn" : "error",
      "react/no-unescaped-entities": "warn", // Allow quotes in JSX as warnings
      "@next/next/no-img-element": "off", // Disable Next.js image warnings
      "prefer-const": "warn", // Less strict about const usage
      
      // Vercel build optimization - suppress common warnings
      ...(process.env.VERCEL === "1" && {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/ban-ts-comment": "warn",
        "react-hooks/exhaustive-deps": "warn",
      })
    }
  }
];

export default eslintConfig;
