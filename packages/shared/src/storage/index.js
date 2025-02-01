import cookie from './cookie'
import localStorage from './localStorage'
import sessionStorage from './sessionStorage'
import memory from './memory'
import validateStore from './validateStore'

const stores = {
  cookie,
  localStorage,
  sessionStorage,
  memory,
}

export default sdk => {
  const { name = 'cookie', custom } = sdk.getOptions()?.store || {}

  if (validateStore(custom)) return custom

  const makeStore = stores[name] || stores.cookie
  const store = makeStore()

  if (store.supported) return store

  return stores.memory()
}
