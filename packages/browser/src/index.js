import makeCoreSdk from '@xaiku/core'
import { makeTrack, makeProjects, makePerformanceObserver, isBrowser } from '@xaiku/shared'
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
  let parentDestroy = instance.destroy

  if (!isBrowser()) {
    throw new Error(
      `@xaiku ${instance.options.framework} runs only on browsers and expects document to exist.`
    )
  }

  instance.pos = makePerformanceObserver(instance.trigger)
  instance.pos.connect()

  instance.on('hide', instance.pos.disconnect)

  if (!instance.options.skipClient) instance.client = makeClient(instance)

  makeProjects(instance)
  instance.track = makeTrack(instance)

  instance.destroy = () => {
    if (!instance) return
    instance.track?.destroy?.()
    instance.client?.destroy?.()
    instance.pos.disconnect()
    parentDestroy()
    instance = null
  }

  return instance
}
