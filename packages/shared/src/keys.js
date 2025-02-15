const publicKeyPrefix = 'pk_'
const isPublicKey = key => key.startsWith('pk_')

const getToken = key => key.slice(publicKeyPrefix.length)

const apiUrlByEnv = {
  development: 'http://localhost:3000/api/',
  production: 'https://xaiku.com/api/',
}

const getApiUrl = ({ proxyApiUrl, dev } = {}) => {
  if (dev) return apiUrlByEnv.development
  if (proxyApiUrl) return proxyApiUrl

  return apiUrlByEnv.production
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
  const apiUrl = getApiUrl(sdk.getOptions())

  return {
    apiUrl,
    token,
  }
}
