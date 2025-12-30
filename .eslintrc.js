
// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    'expo',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'import'],
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  ignorePatterns: ['/dist/*', '/public/*', '/babel-plugins/*'],
  env: {
    browser: true,
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-as-const": "warn",
    "@typescript-eslint/no-var-requires": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-empty-object-type": "warn",
    "@typescript-eslint/no-wrapper-object-types": "warn",
    "@typescript-eslint/ban-tslint-comment": "off",
    "react/no-unescaped-entities": "off",
    "import/no-unresolved": "error",
    "prefer-const": "warn",
    "react/prop-types": "off",
    "no-case-declarations": "warn",
    "no-empty": "warn",
    "react/display-name": "off",
    "no-var": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }]
  },
  overrides: [
    {
      files: ['metro.config.js', 'babel.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
};
