// ESLint flat config (ESLint 9+).
// clock-practice.js and clock-logic.js run in the browser as ES modules
// (index.html loads scripts/clock-practice.js with <script type="module">).
// Browser globals come from the `globals` package (a development dependency),
// so the no-undef rule catches real undefined references without a hand-kept list.

import globals from 'globals';

export default [
  {
    files: ['scripts/clock-practice.js', 'scripts/clock-logic.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': ['error'],
      'no-undef': 'error',
      'eqeqeq': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': ['error'],
      'no-undef': 'error',
      'eqeqeq': 'error',
    },
  },
];
