'use client'

import React, { createContext, version, useContext, useEffect, useState } from 'react'
import makeSdk from '@xaiku/browser'

export const XaikuContext = createContext(null)

export const useSdk = () => useContext(XaikuContext)

const Provider = ({ children, pkey, sdk: sdkProp, ...rest }) => {
  const [sdk, setSdk] = useState(sdkProp || null)

  useEffect(() => {
    if (sdkProp) return

    const instance = makeSdk({
      pkey,
      framework: 'react',
      frameworkVersion: version,
      ...rest,
    })
    setSdk(instance)

    return () => instance?.destroy?.()
  }, [])

  return <XaikuContext.Provider value={sdk}>{children}</XaikuContext.Provider>
}

export default Provider
