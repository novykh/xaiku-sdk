const isES6 = process.env.BABEL_ENV === 'es6'
const isCJS = process.env.BABEL_ENV === 'cjs'

module.exports = api => {
  const isTest = api.env('test')

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: false,
          modules: isES6 ? false : isCJS ? 'commonjs' : false,
          ...(isTest && { targets: { node: 'current' } }),
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      !isTest && [
        'module-resolver',
        {
          alias: {
            '~': './src',
            react: 'react',
            'react-dom': 'react-dom',
          },
        },
      ],
    ].filter(Boolean),
    ignore: ['**/*.test.js', '**/*.stories.js', 'stories/**/*'],
  }
}
