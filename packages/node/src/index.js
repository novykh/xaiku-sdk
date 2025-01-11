import { makeListeners, makeFnProxy } from '@xaiku/shared'
import makeClient from './client'

const defaultOptions = {
  appName: 'xaiku',
  version: 'N/A',
}

export default (options = {}) => {
  const { appName, version } = { ...defaultOptions, ...options }

  const listeners = makeListeners()

  let instance = {
    appName,
    version,
    ...makeFnProxy(listeners.trigger),
    ...listeners,
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

  return {
    ...instance,
    client,
  }
}
