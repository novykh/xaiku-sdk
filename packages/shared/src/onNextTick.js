import isBrowser from '~/isBrowser'

export default callback => {
  if (isBrowser() && typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => requestAnimationFrame(callback))
  } else {
    callback()
  }
}
