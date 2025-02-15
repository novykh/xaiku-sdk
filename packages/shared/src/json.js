export const deserialize = (val, fallback = null) => {
  try {
    return val ? JSON.parse(val) : null
  } catch (e) {
    return fallback || val
  }
}

export const serialize = val => (typeof val !== 'string' ? JSON.stringify(val) : val)
