import isBrowser from '@/isBrowser'
import makeBrowserCookie from '@/storage/cookie'

const initGuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

const cookieName = 'xaikuguid'
let guid = null

const browserGetGuid = sdk => {
  if (guid) return guid

  const cookie = makeBrowserCookie(sdk)

  guid = cookie.get(cookieName)

  if (guid) return guid

  guid = initGuid()

  cookie.set(cookieName, guid)

  return guid
}

export default (sdk, req, res) => {
  if (isBrowser()) return browserGetGuid(sdk)

  if (req?.cookies?.[cookieName]) return req.cookies[cookieName]

  guid = initGuid()
  const secure = sdk.getOptions()?.store?.secure ?? true

  if (res) res.cookie(cookieName, guid, { httpOnly: true, secure })

  return guid
}
