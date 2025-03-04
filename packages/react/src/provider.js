'use client'

import React, { createContext, version, useContext, useEffect, useState } from 'react'
import makeSDK from '@xaiku/browser'

export const XaikuContext = createContext(null)

export const useSDK = () => useContext(XaikuContext)

const Provider = ({ children, pkey, sdk, userId, ...rest }) => {
  const [memoizedSDK, setMemoizedSDK] = useState(sdk)

  useEffect(() => {
    if (memoizedSDK) return

    setMemoizedSDK(
      sdk ||
        makeSDK({
          pkey,
          framework: 'react',
          frameworkVersion: version,
          userId,
          guid: userId,
          ...rest,
        })
    )
  }, [])

  return <XaikuContext.Provider value={memoizedSDK}>{children}</XaikuContext.Provider>
}

export default Provider
