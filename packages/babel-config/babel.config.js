const isES6 = process.env.BABEL_ENV === 'es6'

module.exports = api => {
  const isTest = api.env('test')

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: isES6 ? false : 'commonjs',
          ...(isTest && { targets: { node: 'current' } }),
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-transform-spread',
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
          },
        },
      ],
    ].filter(Boolean),
    env: {
      test: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-runtime'],
      },
    },
  }
}