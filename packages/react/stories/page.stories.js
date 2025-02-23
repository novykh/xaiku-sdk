import React, { Suspense } from 'react'
import { expect, userEvent, within } from '@storybook/test'
import { http, HttpResponse, delay } from 'msw'

const Page = React.lazy(() => import('./page'))

export const SuspendedPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Page />
  </Suspense>
)

export default {
  title: 'Example/Page',
  component: SuspendedPage,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
    msw: {
      handlers: [
        http.get('http://localhost:3000/api/v1/projects', async () => {
          await delay()
          return await HttpResponse.json({
            projects: {
              '66a7aa430d37c7d301230442': [
                {
                  parts: {
                    header: 'Welcome to Acme',
                    action: 'Sign up',
                  },
                  weight: 50,
                },
                {
                  parts: {
                    header: 'Hello, this is Acme',
                    action: 'Register now!',
                  },
                  weight: 50,
                },
              ],
            },
          })
        }),
      ],
    },
  },
}

export const LoggedOut = {}

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const LoggedIn = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const loginButton = canvas.getByRole('button', { name: /Log in/i })
    await expect(loginButton).toBeInTheDocument()
    await userEvent.click(loginButton)
    await expect(loginButton).not.toBeInTheDocument()

    const logoutButton = canvas.getByRole('button', { name: /Log out/i })
    await expect(logoutButton).toBeInTheDocument()
  },
}
