import nextPlugin from '@next/eslint-plugin-next'
import reactConfig from './react.eslint.config.mjs'

export default [
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'no-html-link-for-pages': 'off',
    },
  },
  ...reactConfig,
]
