import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// Fix "ReferenceError: __dirname is not defined in ES module scope"
const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename)

const isProduction = process.env.NODE_ENV === 'production'

export default {
  mode: process.env.NODE_ENV || 'development',
  devtool: !isProduction ? 'eval-cheap-source-map' : 'hidden-source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? 'xaiku.min.js' : 'xaiku.js',
    library: 'xaiku_node',
    libraryTarget: 'var',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [new CleanWebpackPlugin(), new NodePolyfillPlugin()],
  resolve: {
    fallback: { process: require.resolve('process/browser') },
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}
