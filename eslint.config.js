// ESLint flat config (ESLint 9+).
// clock-practice.js runs in the browser as a classic script (no module system).
// Browser globals come from the `globals` package (a development dependency),
// so the no-undef rule catches real undefined references without a hand-kept list.

import globals from 'globals';

export default [
  {
    files: ['clock-practice.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
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
];
