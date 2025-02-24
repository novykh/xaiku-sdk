export const assignRef = (ref, value) => {
  if (ref == null) return

  if (typeof ref === 'function') {
    ref(value)
    return
  }

  try {
    ref.current = value
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}'`)
  }
}

export const mergeRefs =
  (...refs) =>
  node => {
    refs.forEach(ref => assignRef(ref, node))
  }
