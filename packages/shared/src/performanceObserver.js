// Supported Entry Types
// ===========
// element
// event
// first-input
// largest-contentful-paint
// layout-shift
// longtask
// mark
// measure
// navigation
// paint
// resource

const attrByType = {
  paint: 'name',
}

const bufferedByType = {
  navigation: false,
}

const makePerformanceObserver = (entryType, trigger, options = {}) => {
  try {
    const po = new PerformanceObserver(list => {
      Promise.resolve().then(() => {
        trigger(`${entryType}:list`, list.getEntries())

        list.getEntries().forEach(entry => {
          trigger(entry.entryType, entry, po)

          const attrToReport = attrByType[entry.entryType]
          if (entry[attrToReport]) trigger(entry[attrToReport], entry, po)
        })
      })
    })

    po.observe({
      type: entryType,
      buffered: typeof bufferedByType[entryType] === 'undefined' ? true : bufferedByType[entryType],
      ...(options[entryType] || {}),
    })

    return po
  } catch (e) {
    // Do nothing.
  }
}

export default (trigger, options) => {
  let all = {}

  const connect = key => {
    if (key) {
      all[key] = makePerformanceObserver(key, trigger, options)
      return
    }

    PerformanceObserver.supportedEntryTypes.forEach(
      entryType => (all[entryType] = makePerformanceObserver(entryType, trigger, options))
    )
  }

  const disconnect = key => {
    if (key && all[key]) {
      all[key].disconnect()
      return
    }

    Object.keys(all).forEach(key => all[key].disconnect())
  }

  const get = key => all[key]

  return { all, get, connect, disconnect }
}
