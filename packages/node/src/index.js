import makeCoreSdk from '@xaiku/core'
import { makeProjects, isBrowser } from '@xaiku/shared'
import makeClient from './client'

const defaultOptions = {
  framework: 'node',
  store: {
    name: 'memory',
    custom: null,
  },
}

export default async (options = {}) => {
  let instance = makeCoreSdk({ ...defaultOptions, ...options })
  let parentDestroy = instance.destroy

  if (isBrowser()) {
    throw new Error(
      `@xaiku ${instance.options.framework} runs only on Node.js/server environments.`
    )
  }

  if (!instance.options.skipClient) instance.client = makeClient(instance)

  await makeProjects(instance)

  instance.destroy = () => {
    if (!instance) return
    instance.client?.destroy?.()
    parentDestroy()
    instance = null
  }

  return instance
}
