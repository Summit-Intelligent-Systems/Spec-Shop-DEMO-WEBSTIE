/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'import', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['apps/*/tsconfig.json', 'packages/*/tsconfig.json'],
      },
    },
  },
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

    // Imports
    // Import ordering is enforced by the Trivago Prettier plugin. Keeping the
    // ESLint rule disabled avoids conflicting classifications for workspace
    // packages such as @xyz-eyewear/*.
    'import/order': 'off',
    'import/default': 'off',
    // TypeScript's compiler performs module resolution and path-alias checks.
    // The ESLint resolver cannot reliably resolve the Next.js @/* alias from
    // every workspace package, so leave this check to `npm run type-check`.
    'import/no-unresolved': 'off',
    'import/no-duplicates': 'error',
    'import/no-cycle': 'error',

    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    eqeqeq: ['error', 'always'],
    curly: 'off',
    'no-throw-literal': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  overrides: [
    {
      // Relax rules for config files
      files: ['*.config.ts', '*.config.js', 'turbo.json'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
    {
      // Backend-specific
      files: ['apps/api/**/*.ts'],
      rules: {
        'no-console': 'off', // Logger used instead
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.next/',
    'out/',
    'coverage/',
    '.turbo/',
    'prisma/migrations/',
  ],
};
