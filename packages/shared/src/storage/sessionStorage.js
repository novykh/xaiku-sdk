import isBrowser from '~/isBrowser'
import { deserialize, serialize } from '~/json'
import validateStore from './validateStore'

export const name = Symbol('XAIKU@sessionStorage')

export default () => {
  const store = {
    name,
    supported: isBrowser() && !!window.sessionStorage,
    get: name => deserialize(window.sessionStorage.getItem(name)),
    set: (name, value) => window.sessionStorage.setItem(name, serialize(value)),
    delete: name => window.sessionStorage.removeItem(name),
  }

  validateStore(store)

  return store
}
