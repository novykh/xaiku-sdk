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
    store.supported = false
  }
  return false
}
