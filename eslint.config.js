// eslint.config.js

const eslintPluginReact = require('eslint-plugin-react');
const eslintPluginReactHooks = require('eslint-plugin-react-hooks');
const eslintPluginJsxA11y = require('eslint-plugin-jsx-a11y');
const typescriptEslintParser = require('@typescript-eslint/parser');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  // Basic ESLint configurations for TypeScript
  {
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['scripts/*'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        endOfLine: 'auto',
        project: './tsconfig.json',
      },
    },
    rules: {
      'no-trailing-spaces': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['error', { allow: ['warn', 'error', 'info', 'debug'] }],
      'no-debugger': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
    },
  },

  // React specific configurations for TypeScript
  {
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      'jsx-a11y': eslintPluginJsxA11y,
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['scripts/*'],
    rules: {
      'react/jsx-uses-react': 'off', // React 17+ no longer needs this
      'react/react-in-jsx-scope': 'off', // React 17+ no longer needs this
      'react/prop-types': 'off', // Disable prop-types as we use TypeScript
      'react/display-name': 'off',
      'react/jsx-uses-vars': 'off', // Disable due to context.markVariableAsUsed issue
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'off',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'off',
      'react/no-deprecated': 'warn',
      'react/no-direct-mutation-state': 'off', // Disable due to context.getScope issue
      'react/no-find-dom-node': 'warn',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'off', // Disable due to context.getScope issue
      'react/no-string-refs': 'off', // Disable due to context.getScope issue
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',
      'react/no-unsafe': 'warn',
      'react/require-render-return': 'off', // Disable due to context.getScope issue
      'react/self-closing-comp': 'error',
      'react/style-prop-object': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-comment-textnodes': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-props-no-spreading': 'off', // Can be turned on based on team preference
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-fragments': ['off', 'syntax'],
    },
  },

  // React Hooks specific configurations
  {
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
    },
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['scripts/*'],
  },

  // Accessibility specific configurations
  {
    rules: {
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-role': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/html-has-lang': 'warn',
      'jsx-a11y/iframe-has-title': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/no-access-key': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-distracting-elements': 'warn',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'jsx-a11y/scope': 'warn',
    },
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['scripts/*'],
  },
];
