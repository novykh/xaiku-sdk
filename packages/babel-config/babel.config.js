const isES6 = process.env.BABEL_ENV === 'es6'
const isCJS = process.env.BABEL_ENV === 'cjs'
const isUMD = process.env.BABEL_ENV === 'umd'

module.exports = api => {
  const isTest = api.env('test')

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: false,
          modules: isES6 ? false : isCJS ? 'commonjs' : isUMD ? 'umd' : false,
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
      isUMD && '@babel/plugin-syntax-dynamic-import',
      isUMD && '@babel/plugin-transform-modules-umd',
    ].filter(Boolean),
  }
}
