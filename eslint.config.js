// ESLint flat config (ESLint 9+).
// Both JS files run in the browser as classic scripts (no module system).
// ELEMENTS is defined in elements-data.js and consumed by periodic-table.js;
// it is exposed as a browser global, not via import/export.

import globals from 'eslint/use-at-your-own-risk';

export default [
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        document: 'readonly',
        window: 'readonly',
        requestAnimationFrame: 'readonly',
        // ELEMENTS is defined in elements-data.js; periodic-table.js reads it
        // as a browser global set by the first script tag.
        ELEMENTS: 'writable',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^ELEMENTS$' }],
      'no-undef': 'error',
      'eqeqeq': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
  },
];
