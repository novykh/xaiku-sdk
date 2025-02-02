import isBrowser from '@/isBrowser'
import makeBrowserCookie from '@/storage/cookie'

const initGuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

const storeName = 'xaikuguid'

export default sdk => {
  let guid = sdk.storage.get(storeName)

  if (!uuid) {
    guid = initGuid()
    sdk.storage.set(storeName, guid)
  }
  
  return guid
}
