import React, { createContext, version, useMemo } from 'react'
import browserSDK from '@xaiku/browser'

export const XaikuContext = createContext(null)

const Provider = ({ children, pkey, sdk, ...rest }) => {
  const memoizedSdk = useMemo(
    () => sdk || browserSDK({ ...rest, pkey, framework: 'react', frameworkVersion: version }),
    [sdk, pkey]
  )

  return <XaikuContext.Provider value={memoizedSdk}>{children}</XaikuContext.Provider>
}

export default Provider
