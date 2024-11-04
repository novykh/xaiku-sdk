
import makeListeners from '@/helpers/listeners'
import makePerformanceObserver from '@/helpers/performanceObserver'
import makeFnProxy from '@/helpers/makeFnProxy'
import makeClient from './client'

const defaultOptions = {
  appName: 'xaiku',
  version: 'N/A',
}

export default (options = {}) => {
  const { appName, version } = { ...defaultOptions, ...options }

  const listeners = makeListeners()

  const pos = makePerformanceObserver(listeners.trigger)
  pos.connect()

  listeners.on('hide', pos.disconnect)

  let instance = {
    appName,
    version,
    pos,
    ...makeFnProxy(listeners.trigger),
    ...listeners,
  }

  instance.on("metric:report", metric => {
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
    client
  }
}
