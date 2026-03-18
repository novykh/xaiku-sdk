import { themes as prismThemes } from 'prism-react-renderer'

const config = {
  title: 'Xaiku SDK',
  tagline: 'AI-powered variant generation and A/B testing for marketing copy',
  favicon: 'img/favicon.ico',

  url: 'https://novykh.github.io',
  baseUrl: '/xaiku-sdk/',

  organizationName: 'novykh',
  projectName: 'xaiku-sdk',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/novykh/xaiku-sdk/tree/main/packages/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Xaiku SDK',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/novykh/xaiku-sdk',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Quickstarts', to: '/docs/quickstarts/browser' },
            { label: 'Guides', to: '/docs/guides/installation' },
            { label: 'SDK Reference', to: '/docs/sdk/core' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'GitHub', href: 'https://github.com/novykh/xaiku-sdk' },
            { label: 'npm', href: 'https://www.npmjs.com/org/xaiku' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Xaiku.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
}

export default config
