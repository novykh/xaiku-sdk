import {
  makeListeners,
  makeFnProxy,
  parsePublicKey,
  makeStorage,
  getGuid,
  noop,
} from '@xaiku/shared'
import makeClient from './client'

export const defaultOptions = {
  appName: 'xaiku',
  version: 'N/A',
  store: {
    name: 'memory',
    custom: null,
  },
  onReport: noop,
}

export default (options = {}) => {
  options = { ...defaultOptions, ...options }

  const { appName, version, pkey, projectIds, onReport } = options

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

  instance.client = makeClient(instance)

  instance.on('metric:report', metric => onReport(metric, instance))

  return instance
}
