import nextPlugin from '@next/eslint-plugin-next'
import reactConfig from './react.eslint.config.mjs'

export default [
  ...reactConfig,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { '@next/next': nextPlugin.configs.recommended },
    rules: {
      'no-html-link-for-pages': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
]
