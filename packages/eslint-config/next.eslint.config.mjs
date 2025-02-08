import nextPlugin from '@next/eslint-plugin-next'
import reactConfig from './react.eslint.config.mjs'

export default [
  ...reactConfig,
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'no-html-link-for-pages': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
]
