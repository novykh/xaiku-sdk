const checkMaxSize = (data, maxSize) => {
  try {
    const stringified = JSON.stringify(data)
    return stringified.length <= maxSize // < 4KB
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return false
  }
}

export const checkSizeForCookie = data => checkMaxSize(data, 4e3)

export const checkSizeForLocalStorage = data => checkMaxSize(data, 1e6)

const key = '_xaiku_foo_'
const val = '_xaiku_bar_'

export default store => {
  if (typeof store !== 'object' || store === null) store = { supported: false }

  try {
    if (store.supported) {
      store.set(key, val)
      if (store.get(key) !== val) {
        store.supported = false
        return false
      }
      store.delete(key)
      return true
    }
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    console.warn('Store not supported', store.name, val, store.get(key))
    store.supported = false
  }
  return false
}
