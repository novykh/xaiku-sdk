import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettierRecommended from '@xaiku/prettier-config/eslint-plugin.mjs'

export default defineConfig([
  pluginJs.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  prettierRecommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 2025,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es6,
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      'react/display-name': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'react/prop-types': 'off',
    },
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  globalIgnores([
    // Ignore dotfiles
    '.*.js',
    'node_modules/',
    'dist/',
  ]),
])
