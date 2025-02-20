const isES6 = process.env.BABEL_ENV === 'es6'

module.exports = api => {
  const isTest = api.env('test')

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: false,
          modules: isES6 ? false : 'commonjs',
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
            '@': './src',
          },
        },
      ],
    ].filter(Boolean),
  }
}
