import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';

import reactPlugin from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';

const compat = new FlatCompat();

export default tseslint.config(
  { ignores: ['**/dist/**', '*.config.js'] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,

      'react/react-in-jsx-scope': 'off',
    },
  },
  ...compat.config({
    extends: ['plugin:react-hooks/recommended'],
  }),
  eslintConfigPrettier,
);
