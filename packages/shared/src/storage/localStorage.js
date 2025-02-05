import isBrowser from '@/isBrowser'
import { deserialize, serialize } from '@/json'
import validateStore from './validateStore'

export default () => {
  let _localStorage = null

  const store = {
    name: 'localStorage',
    supported: isBrowser() && !!window.localStorage,
    get: name => deserialize(_localStorage.getItem(name)),
    set: (name, value) => _localStorage.setItem(name, serialize(value)),
    delete: name => _localStorage.removeItem(name),
  }

  validateStore(store)

  return store
}
