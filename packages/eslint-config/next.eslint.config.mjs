import { defineConfig, globalIgnores } from 'eslint/config'
import next from 'eslint-config-next'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...next,
  ...nextCoreWebVitals,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    rules: {
      'no-html-link-for-pages': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },
  globalIgnores(['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])
