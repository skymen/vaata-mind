module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  settings: {
    'import/core-modules': [
      '@vercel/node',
    ],
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    indent: 'off',

    camelcase: 'off',
    'no-restricted-syntax': 'off',

    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/ban-ts-comment': 0,
  },
};
