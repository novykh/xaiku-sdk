import makeSDK from '@xaiku/node'
import nextjsLib from 'next/package.json'

export { default as XaikuProvider } from './provider'

export default (options = {}) =>
  makeSDK({ ...options, framework: 'nextjs', frameworkVersion: nextjsLib?.version || 'N/A' })
