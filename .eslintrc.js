module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ]
  },
  overrides: [
    {
      files: ['apps/shelter-gateway/**/*.{ts,tsx,js,jsx}'],
      rules: {
        // '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
    {
      files: ['apps/shelter-accounts/**/*.{ts,tsx,js,jsx}'],
      rules: {
        // '@typescript-eslint/explicit-function-return-type': 'warn',
      },
    },
    {
      files: ['apps/shelter-client/**/*.{ts,tsx,js,jsx}'],
    },
  ],
};
