export const getCookie = name => {
  name = name + "="
  const decodedCookie = decodeURIComponent(document.cookie)
  const parts = decodedCookie.split(";")

  return parts.reduce((value, part) => {
    part = part.trim()

    return value
      ? value
      : part.indexOf(name) === 0
      ? part.substring(name.length, part.length)
      : null
  }, null)
}
