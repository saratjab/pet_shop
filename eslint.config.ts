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
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import { ESLint } from 'eslint';

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.d.ts', 'eslint.config.ts'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint as unknown as ESLint.Plugin,
      import: importPlugin,
    },
    rules: {
      // Basic rules
      indent: ['error', 2],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'prefer-const': 'error',

      // TypeScript rules
      ...tseslint.configs['recommended'].rules,
      ...tseslint.configs['recommended-requiring-type-checking'].rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',

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
          alphabetize: { order: 'asc' },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
    },
  },
]);
