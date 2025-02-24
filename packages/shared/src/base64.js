export const isomorphicAtob = data => {
  if (typeof atob !== 'undefined' && typeof atob === 'function') {
    return atob(data)
  } else if (typeof global !== 'undefined' && global.Buffer) {
    return new global.Buffer.from(data, 'base64').toString()
  }
  return data
}

export const isomorphicBtoa = data => {
  if (typeof btoa !== 'undefined' && typeof btoa === 'function') {
    return btoa(data)
  } else if (typeof global !== 'undefined' && global.Buffer) {
    return new global.Buffer.from(data).toString('base64')
  }
  return data
}
