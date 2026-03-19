const isES6 = process.env.BABEL_ENV === 'es6'
const isCJS = process.env.BABEL_ENV === 'cjs'
const moduleResolver = require('babel-plugin-module-resolver').default

module.exports = api => {
  const isTest = api.env('test')
  const useModuleResolver = isES6 || isCJS

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
      !isTest &&
        useModuleResolver && [
          moduleResolver,
          {
            alias: {
              '~': './src',
              react: 'react',
              'react-dom': 'react-dom',
            },
          },
        ],
    ].filter(Boolean),
    ignore: [!isTest && '**/*.test.js'].filter(Boolean),
  }
}
