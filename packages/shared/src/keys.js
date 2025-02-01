import { isomorphicAtob } from '@/base64'
import ensureOneSlash from '@/ensureOneSlash'

// example public key = pk_live_abc123

const publicKeyPrefix = 'pk_'
const isPublicKey = key => key.startsWith('pk_')

const livePublicKeyPrefix = publicKeyPrefix + 'live_'

const getEnv = key => (key.startsWith(livePublicKeyPrefix) ? 'production' : 'development')

const getApiUrl = key => ensureOneSlash(isomorphicAtob(key.slice(livePublicKeyPrefix.length)))

export const parsePublicKey = key => {
  if (!key || !isPublicKey(key)) {
    throw new Error(
      'Public key is missing. Access your xaiku keys here: https://xaiku.com/dashboard/settings/keys'
    )
  }

  const apiUrl = getApiUrl(key)
  const apiEnv = getEnv(key)

  return {
    apiEnv,
    apiUrl,
  }
}
