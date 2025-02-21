import isBrowser from '~/isBrowser'
import { deserialize, serialize } from '~/json'
import validateStore from './validateStore'

const defaultConfig = {
  crossSubdomain: true,
  secure: true,
  expiresAfterDays: 7,
}

const getExpiresUtcString = days => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  return date.toUTCString()
}

export default sdk => {
  const { crossSubdomain, secure, expiresAfterDays } = sdk.options?.store || defaultConfig

  let domain = null

  const getDomain = () => {
    if (domain) return domain

    domain = window.location.hostname.split('.').slice(-2).join('.')
    return domain
  }

  const store = {
    name: Symbol('XAIKU@cookie'),
    supported: isBrowser(),
    get: name => {
      try {
        name = name + '='
        const decodedCookie = decodeURIComponent(document.cookie)
        const parts = decodedCookie.split(';')

        const value = parts.reduce((str, part) => {
          part = part.trim()

          return str
            ? str
            : part.indexOf(name) === 0
              ? part.substring(name.length, part.length)
              : null
        }, null)

        return deserialize(value)
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // do nothing
      }
      return null
    },
    set: (name, value) => {
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(serialize(value))}; path=/`

      if (expiresAfterDays) cookieString += `; expires=${getExpiresUtcString(expiresAfterDays)}`
      if (crossSubdomain) cookieString += `; domain=.${getDomain()}`
      if (secure) cookieString += '; secure'

      document.cookie = cookieString
    },
    delete: name => store.set(name, ''),
  }

  validateStore(store)

  return store
}
