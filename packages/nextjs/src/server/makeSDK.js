import makeSDK from '@xaiku/node'
import nextjsLib from 'next/package.json'

export default (options = {}) =>
  makeSDK({
    ...options,
    pkey: options.pkey ?? process.env.NEXT_PUBLIC_XAIKU_API_KEY,
    framework: 'nextjs',
    frameworkVersion: nextjsLib?.version || 'N/A',
    skipClient: true,
    skipProjects: true,
  })
