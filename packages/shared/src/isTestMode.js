/** @deprecated Use sdk.options.testMode instead. Kept for backwards compatibility. */
export default () => {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem('xaiku_test') === 'true'
  } catch {
    return false
  }
}
