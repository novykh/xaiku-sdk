export const noop = () => {}

export const isObject = value => {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function') && !Array.isArray(value)
}

export const isEmptyObject = value => isObject(value) && Object.keys(value).length === 0
