import isBrowser from '~/isBrowser'
import { deserialize, serialize } from '~/json'
import validateStore from './validateStore'

export const name = Symbol('XAIKU@localStorage')

export default () => {
  const store = {
    name,
    supported: isBrowser() && !!window.localStorage,
    get: name => deserialize(window.localStorage.getItem(name)),
    set: (name, value) => window.localStorage.setItem(name, serialize(value)),
    delete: name => window.localStorage.removeItem(name),
  }

  validateStore(store)

  return store
}
