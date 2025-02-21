import isBrowser from '~/isBrowser'
import isNode from '~/isNode'

export default callback => {
  if (isBrowser() && typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => requestAnimationFrame(callback))
  } else if (isNode() && typeof setImmediate === 'function') {
    setImmediate(callback)
  } else {
    setTimeout(callback, 0)
  }
}
