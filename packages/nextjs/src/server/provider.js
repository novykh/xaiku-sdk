'use server'

import { cookies } from 'next/headers'
import React from 'react'
import nextjsLib from 'next/package.json'
import makeSDK from '@xaiku/node'
import { XaikuProvider as ClientProvider } from '@xaiku/react'

const getState = React.cache(async (pkey, options = {}) => {
  const cookieStore = await cookies()
  const custom = {
    name: 'cookie',
    supported: true,
    get: key => cookieStore.get(key),
    set: (key, value) => cookieStore.set(key, value),
    delete: key => cookieStore.delete(key),
  }

  const sdk = makeSDK({
    pkey: process.env.NEXT_PUBLIC_XAIKU_API_KEY,
    store: { custom },
    framework: 'nextjs',
    frameworkVersion: nextjsLib?.version || 'N/A',
    ...options,
  })

  return sdk
})

const Provider = async ({
  children,
  pkey = process.env.NEXT_PUBLIC_XAIKU_API_KEY,
  sdk,
  ...rest
}) => {
  const memoizedSdk = sdk || (await getState(pkey, rest))

  return (
    <ClientProvider {...rest} pkey={pkey} store={{ name: 'cookie' }}>
      {children}
    </ClientProvider>
  )
}

export default Provider
