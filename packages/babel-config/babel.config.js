const isES6 = process.env.BABEL_ENV === 'es6'
const isCJS = process.env.BABEL_ENV === 'cjs'

module.exports = api => {
  const isTest = api.env('test')

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          ...(isTest
            ? { targets: { node: 'current' }, modules: 'commonjs' }
            : { loose: false, modules: isES6 ? false : isCJS ? 'commonjs' : false }),
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
    ignore: [!isTest && '**/*.test.js', '**/*.stories.js', 'stories/**/*'].filter(Boolean),
  }
}
