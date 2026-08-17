import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * Flat config (ESLint 10). `eslint-config-next` 16 exporta configuraciones
 * flat nativas, sin necesidad del puente FlatCompat.
 *
 * El helper `toArray` es deliberado: los sub-exports pueden entregar un
 * objeto de config o un array de configs segun la version. Normalizarlo aqui
 * evita que una actualizacion menor de Next rompa el arranque del linter.
 */
const toArray = (config) => (Array.isArray(config) ? config : [config]);

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
      "public/**",
    ],
  },

  ...toArray(coreWebVitals),
  ...toArray(nextTypescript),

  {
    rules: {
      /* --- Higiene de tipos --------------------------------------------- */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      /* --- Higiene general ---------------------------------------------- */
      // `console.log` no llega a produccion; warn y error si son legitimos.
      "no-console": ["error", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],

      /* --- Orden de imports --------------------------------------------- */
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "type",
          ],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
];

export default eslintConfig;
