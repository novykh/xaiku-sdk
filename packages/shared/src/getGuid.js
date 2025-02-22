import onNextTick from '~/onNextTick'

const createGuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

const stringToGuid = string => {
  if (typeof string !== 'string') return createGuid()

  const hash = Array.from(string).reduce((acc, c) => {
    acc = (acc << 5) - acc + c.charCodeAt(0)
    return acc & acc
  }, 0)
  return `00000000-0000-4000-8000-${hash.toString(16).padStart(12, '0')}`
}

// validate and sanitize it rigorously to prevent security issues
const validate = guid => {
  if (typeof guid !== 'string') return false
  if (guid.length !== 36) return false
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(guid))
    return false
  return guid
}

const sanitize = guid => {
  if (validate(guid)) return guid
  return stringToGuid(guid)
}

export const key = '__xaiku__guid__'

export default sdk => {
  let guid = sdk.storage.get(key)
  if (guid) return guid

  guid = sanitize(sdk.options.guid)
  onNextTick(() => sdk.storage.set(key, guid))

  return guid
}
