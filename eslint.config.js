// ESLint flat config (ESLint 9+).
// clock-practice.js runs in the browser as a classic script (no module system).
// All browser globals used by the script are declared explicitly below so that
// the no-undef rule catches real undefined references without raising false errors.
// The globals package is not imported because Clock-Practice has no package
// manifest and the package may not resolve.

export default [
  {
    files: ['clock-practice.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        // Core DOM and browser APIs used throughout clock-practice.js
        document: 'readonly',       // getElementById, querySelector, createElement, createElementNS, addEventListener, body
        window: 'readonly',         // window.matchMedia (prefers-reduced-motion check in launchConfetti)
        navigator: 'readonly',      // navigator.canShare, navigator.share, navigator.clipboard.writeText (share function)
        console: 'readonly',        // console.warn (share function error handling)

        // Timing and async
        setTimeout: 'readonly',     // confetti cleanup in launchConfetti; URL revocation delay in downloadFile
        Promise: 'readonly',        // generateShareImage returns a Promise

        // Maths (built-in but surfaced as a global in classic scripts)
        Math: 'readonly',           // Math.floor, Math.random, Math.PI, Math.cos, Math.sin (clock drawing and confetti)

        // Web APIs used in share-image generation and download
        URL: 'readonly',            // URL.createObjectURL, URL.revokeObjectURL (generateShareImage, downloadFile)
        Blob: 'readonly',           // new Blob([svgString], ...) (generateShareImage)
        Image: 'readonly',          // new Image() (generateShareImage)
        XMLSerializer: 'readonly',  // new XMLSerializer().serializeToString (generateShareImage)
        File: 'readonly',           // new File([blob], 'clock-practice.png', ...) (generateShareImage)
      },
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
