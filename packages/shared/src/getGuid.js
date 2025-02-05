const initGuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

const key = 'xaikuguid'

export default sdk => {
  let guid = sdk.getOptions().guid
  if (guid) return guid

  guid = sdk.storage.get(key)
  if (!guid) {
    guid = initGuid()
    sdk.storage.set(key, guid)
  }

  return guid
}
