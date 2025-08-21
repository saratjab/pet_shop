// import eslint from '@eslint/js';
// import tseslint from 'typescript-eslint';

// export default tseslint.config(
//   eslint.configs.recommended,
//   tseslint.configs.recommended,
// );
// eslint.config.js

// configratoin object contains all the infromation ESLint needs to run, each configuration object is made up of these properties:
//? name: A name for the configraion object - for error messages
// rules: object with rules to be applied
// semi: rule to enforce semicolons at the end of statements
// prefer-const: rule to suggest using const for variables that are never reassigned
//
// eslint.config.ts

import { defineConfig } from 'eslint/config';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**', '**config.ts'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    }, 
    plugins: {
      '@typescript-eslint': tsPlugin as any,
      import: importPlugin,
    },
    rules: {
      'prefer-const': 'error',

      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',

      // Import rules
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
        },
      ],
    },
  },
]);
// test