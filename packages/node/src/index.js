import makeCoreSdk from '@xaiku/core'
import { makeProjects, isNode } from '@xaiku/shared'
import makeClient from './client'

const defaultOptions = {
  framework: 'node',
  store: {
    name: 'memory',
    custom: null,
  },
}

export default (options = {}) => {
  let instance = makeCoreSdk({ ...defaultOptions, ...options })

  if (!isNode()) {
    throw new Error(
      `@xaiku ${instance.options.framework} runs only on Node.js/server environments.`
    )
  }

  instance.client = makeClient(instance)

  makeProjects(instance)

  return instance
}
