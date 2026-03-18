const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Quickstarts',
      collapsed: false,
      items: ['quickstarts/browser', 'quickstarts/react', 'quickstarts/nextjs', 'quickstarts/node'],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/installation',
        'guides/configuration',
        'guides/tracking-events',
        'guides/ab-testing',
        'guides/web-vitals',
        'guides/architecture',
        'guides/server-side',
        'guides/test-mode',
      ],
    },
    {
      type: 'category',
      label: 'SDK Reference',
      items: ['sdk/core', 'sdk/shared', 'sdk/browser', 'sdk/react', 'sdk/nextjs', 'sdk/node'],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: ['api/experiments', 'api/analytics', 'api/authentication'],
    },
    'changelog',
  ],
}

export default sidebars
