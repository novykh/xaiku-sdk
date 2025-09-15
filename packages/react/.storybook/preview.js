/** @type { import('@storybook/react-webpack5').Preview } */
import { initialize, mswLoader } from 'msw-storybook-addon'

initialize({
  onUnhandledRequest: 'warn',
})

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader],
}

export default preview
