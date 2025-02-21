import { join, dirname, resolve } from 'path'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
const getAbsolutePath = value => dirname(require.resolve(join(value, 'package.json')))

/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },
  features: {
    experimentalRSC: true,
  },
  staticDirs: ['../public'],
  webpackFinal: async config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@xaiku/browser': resolve(__dirname, '../../browser/dist/'),
      '@xaiku/shared': resolve(__dirname, '../../shared/dist/'),
      '@xaiku/core': resolve(__dirname, '../../core/dist/'),
      '@xaiku/react': resolve(__dirname, '../../react/dist/'),
      '@xaiku/node': resolve(__dirname, '../../node/dist/'),
      '~': resolve(__dirname, '../../nextjs/src/'),
      process: require.resolve('../__mocks__/process.js'),
      os: require.resolve('../__mocks__/os.js'),
    }

    return config
  },
}
export default config
