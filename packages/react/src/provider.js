import React, { useMemo } from 'react'
import browserSDK from '@xaiku/browser'
import { XaikuContext } from './context'

const Provider = ({ children, apiKey, options }) => {
  const client = useMemo(() => {
    if (apiKey) {
      return browserSDK({ ...options, framework: 'react', frameworkVersion: version })
    }
  }, [client, apiKey])

  return <XaikuContext.Provider value={{ client }}>{children}</XaikuContext.Provider>
}

export default Provider
