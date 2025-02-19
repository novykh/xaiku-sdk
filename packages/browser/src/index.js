import makeCoreSdk from '@xaiku/core'
import { makeProjects, makePerformanceObserver, isBrowser } from '@xaiku/shared'
import makeClient from './client'

const defaultOptions = {
  framework: 'browser',
  store: {
    name: 'localStorage',
    custom: null,
  },
}

export default (options = {}) => {
  let instance = makeCoreSdk({ ...defaultOptions, ...options })

  if (!isBrowser()) {
    throw new Error(
      `@xaiku ${instance.options.framework} runs only on browsers and expects document to exist.`
    )
  }

  instance.pos = makePerformanceObserver(instance.trigger)
  instance.pos.connect()

  instance.on('hide', instance.pos.disconnect)

  instance.client = makeClient(instance)

  makeProjects(instance)

  return instance
}
