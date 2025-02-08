import browserSDK from '@xaiku/browser'
import { version } from 'react'

export { default as XaikuProvider, XaikuContext } from './provider'

export default (options = {}) =>
  browserSDK({ ...options, framework: 'react', frameworkVersion: version })
