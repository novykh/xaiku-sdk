import {
  makeListeners,
  makePerformanceObserver,
  makeFnProxy,
  isBrowser,
  parsePublicKey,
  makeStorage,
} from '@xaiku/shared'
import makeClient from './client'

const defaultOptions = {
  appName: 'xaiku',
  version: 'N/A',
  store: {
    name: 'localStorage',
    custom: null,
  },
}

export default (options = {}) => {
  if (!isBrowser()) {
    throw new Error('@xaiku/browser runs only on browsers and expects document to exist.')
  }

  options = { ...defaultOptions, ...options }
  const { appName, version, pkey } = options

  const { apiEnv, apiUrl } = parsePublicKey(pkey)

  const listeners = makeListeners()

  const pos = makePerformanceObserver(listeners.trigger)
  pos.connect()

  listeners.on('hide', pos.disconnect)

  let instance = {
    getOptions: () => options,
    appName,
    version,
    pos,
    ...makeFnProxy(listeners.trigger),
    ...listeners,
    apiEnv,
    apiUrl,
  }

  instance.on('metric:report', metric => {
    console.log({
      metric: metric.context,
      value: metric.value,
      group: metric.group,
      instance: instance.appName,
      name: metric.name,
      title: metric.title,
      labels: [{ _xaiku: true }, { _instance_version: instance.version }, ...(metric.labels || [])],
      entries: metric.entries,
    })
  })

  const client = makeClient(instance)
  const storage = makeStorage(instance)

  return {
    ...instance,
    client,
    storage,
  }
}
