import { join, dirname, resolve } from 'path'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')))
}

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath("@storybook/addon-docs")
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@xaiku/browser': resolve(__dirname, '../../browser/src/'),
      '@xaiku/shared': resolve(__dirname, '../../shared/src/'),
      '@xaiku/core': resolve(__dirname, '../../core/src/'),
      '~': [
        resolve(__dirname, '../../core/src/'),
        resolve(__dirname, '../../browser/src/'),
        resolve(__dirname, '../../shared/src/'),
        resolve(__dirname, '../../react/src/'),
      ],
    }

    return config
  },
}
export default config
