import { getFrameworks, getGuid } from '@xaiku/shared'
import proxyTimers from './proxyTimers'
import proxyFetch from './proxyFetch'

export default sdk => {
  let session = {
    guid: getGuid(sdk),
    frameworks: getFrameworks(),
  }

  const setAttribute = (key, value) => {
    session[key] = typeof value === 'function' ? value(session[key]) : value
  }

  const setAttributes = values => {
    Object.keys(values).forEach(key => setAttribute(key, values[key]))
  }

  const options = { session }

  // proxyTimers(sdk, options)
  // proxyFetch(sdk, options)

  const destroy = () => {
    session = null
  }

  return {
    destroy,
  }
}
