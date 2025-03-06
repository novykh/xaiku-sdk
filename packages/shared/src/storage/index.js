import cookie, { name as cookieName } from './cookie'
import localStorage, { name as localStorageName } from './localStorage'
import sessionStorage, { name as sessionStorageName } from './sessionStorage'
import memory, { name as memoryName } from './memory'
import validateStore from './validateStore'

export const storeNames = {
  cookie: cookieName,
  localStorage: localStorageName,
  sessionStorage: sessionStorageName,
  memory: memoryName,
}

export { validateStore }
export { checkSizeForCookie, checkSizeForLocalStorage } from './validateStore'

export const stores = {
  cookie,
  localStorage,
  sessionStorage,
  memory,
}

export default sdk => {
  const { name, custom } = sdk.options?.store || {}

  if (validateStore(custom)) return custom

  const makeStore = stores[name] || stores.cookie
  const store = makeStore(sdk)

  if (store.supported) return store

  return stores.memory(sdk)
}
