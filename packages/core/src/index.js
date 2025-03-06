import { makeListeners, makeFnProxy, parsePublicKey, makeStorage, getGuid } from '@xaiku/shared'
import makeClient from './client'

export const defaultOptions = {
  appName: 'xaiku',
  version: 'N/A',
  store: {
    name: 'memory',
    custom: null,
  },
  onReport: null,
}

export default (options = {}) => {
  options = { ...defaultOptions, ...options }

  const { appName, version, pkey, projectIds, skipClient } = options

  const listeners = makeListeners()

  let instance = {
    options,
    appName,
    version,
    ...makeFnProxy(listeners.trigger),
    ...listeners,
    pkey,
    projectIds: projectIds ? (Array.isArray(projectIds) ? projectIds : [projectIds]) : [],
  }

  instance.storage = makeStorage(instance)
  instance.guid = getGuid(instance)

  instance = { ...instance, ...parsePublicKey(instance) }

  if (!skipClient) instance.client = makeClient(instance)

  instance.destroy = () => {
    if (!instance) return
    instance.client?.destroy?.()
  }

  return instance
}
