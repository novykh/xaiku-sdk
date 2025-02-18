import makeCoreSdk from '@xaiku/core'
import { isNode } from '@xaiku/shared'
import makeClient from './client'

const defaultOptions = {
  store: {
    name: 'memory',
    custom: null,
  },
}

export default (options = {}) => {
  let instance = makeCoreSdk({ ...defaultOptions, ...options })

  if (!isNode()) {
    throw new Error('@xaiku/node runs only on Node.js environments.')
  }

  // instance.client = makeClient(instance)

  return instance
}
