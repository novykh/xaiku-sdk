import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import pluginJs from '@eslint/js'
import prettierRecommended from '@xaiku/prettier-config/eslint-plugin.mjs'

export default defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es6,
        ...globals.jest,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  prettierRecommended,
])
