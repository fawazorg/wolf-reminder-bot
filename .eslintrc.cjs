module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  env: {
    node: true,
    es2022: true,
    browser: true
  },
  plugins: ['import', 'node', 'promise', 'perfectionist', 'prettier'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'no-console': 'off',
    'no-await-in-loop': 'off',
    'no-unused-vars': 'error',
    'no-param-reassign': 'warn',
    quotes: ['error', 'single'],
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    'import/first': 'error',
    'import/export': 'error',
    'import/no-duplicates': 'error',
    'import/no-named-default': 'error',
    'import/prefer-default-export': 'off',
    'import/no-webpack-loader-syntax': 'error',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': [
      'off',
      {
        js: 'always'
      }
    ],
    'import/no-absolute-path': [
      'error',
      { amd: false, commonjs: true, esmodule: true }
    ],

    'perfectionist/sort-objects': [
      'error',
      {
        order: 'asc',
        type: 'line-length'
      }
    ]
  }
};
