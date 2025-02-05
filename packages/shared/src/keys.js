const publicKeyPrefix = 'pk_'
const isPublicKey = key => key.startsWith('pk_')

const livePublicKeyPrefix = publicKeyPrefix + 'live_'
const testPublicKeyPrefix = publicKeyPrefix + 'test_'

const isLive = key => key.startsWith(livePublicKeyPrefix)

const getEnv = key => (isLive(key) ? 'production' : 'development')

const getToken = key =>
  key.slice(isLive(key) ? livePublicKeyPrefix.length : testPublicKeyPrefix.length)

const apiUrlByEnv = {
  production: 'https://xaiku.com/api/',
  development: 'http://localhost:3000/api/',
}

const getApiUrl = (env, { proxyApiUrl } = {}) => {
  if (proxyApiUrl) return proxyApiUrl

  return apiUrlByEnv[env] || apiUrlByEnv.development
}

const whereTofindMessage = 'Access your xaiku keys here: https://xaiku.com/dashboard/settings/keys'
export const errorMissingKeyMessage = `Public key is missing. ${whereTofindMessage}`
export const errorInvalidKeyMessage = `Public key is not valid. ${whereTofindMessage}`

export const parsePublicKey = sdk => {
  const key = sdk.pkey

  if (!key) {
    throw new Error(errorMissingKeyMessage)
  }

  if (!isPublicKey(key)) {
    throw new Error(errorInvalidKeyMessage)
  }

  const token = getToken(key)
  const apiEnv = getEnv(key)
  const apiUrl = getApiUrl(apiEnv, sdk.getOptions())

  return {
    apiEnv,
    apiUrl,
    token,
  }
}
