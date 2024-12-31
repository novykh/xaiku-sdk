export default callback => {
  if (document.prerendering) {
    addEventListener('prerenderingchange', callback, true)

    return () => removeEventListener('prerenderingchange', callback, true)
  }
  callback()
  return () => {}
}
