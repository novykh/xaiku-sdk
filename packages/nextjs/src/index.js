import browserSDK from '@xaiku/browser'
import nextjsLib from 'next/package.json'

export { default as XaikuProvider } from './server/provider'

export default (options = {}) =>
  browserSDK({ ...options, framework: 'nextjs', frameworkVersion: nextjsLib?.version || 'N/A' })
