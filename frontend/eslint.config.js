import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  globalIgnores(['dist']),

  // ─────────────────────────────────────────────────────────────────────────
  // Base configuration for all TypeScript files
  // ─────────────────────────────────────────────────────────────────────────
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      // ─────────────────────────────────────────────────────────────────────
      // Code complexity limits
      // ─────────────────────────────────────────────────────────────────────
      "complexity": ["error", 10],
      "max-depth": ["error", 5],
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["error", { max: 280, skipBlankLines: true, skipComments: true }],
      "max-params": ["error", 3],
      "max-nested-callbacks": ["error", 3],
      "max-statements": ["error", 20],

      // ─────────────────────────────────────────────────────────────────────
      // Filename conventions - Default: kebab-case
      // ─────────────────────────────────────────────────────────────────────
      "unicorn/filename-case": ["error", { case: "kebabCase" }],

      // ─────────────────────────────────────────────────────────────────────
      // Additional unicorn rules for code quality
      // ─────────────────────────────────────────────────────────────────────
      "unicorn/no-null": "off",
 
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Pages: PascalCase naming (core/pages, shared/pages, modules/*/pages)
  // ─────────────────────────────────────────────────────────────────────────
  {
    files: [
      'src/core/pages/**/*.tsx',
      'src/shared/pages/**/*.tsx',
      'src/modules/*/pages/**/*.tsx',
    ],
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      "unicorn/filename-case": ["error", { case: "pascalCase" }],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Test files: relaxed rules
  // ─────────────────────────────────────────────────────────────────────────
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/tests/**/*.{ts,tsx}'],
    rules: {
      "max-lines-per-function": "off",
      "max-statements": "off",
      "react-refresh/only-export-components": "off",
      "max-nested-callbacks": "off",
      
    },
  },
])
