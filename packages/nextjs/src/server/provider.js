import React, { cache } from 'react'
import { cookies } from 'next/headers'
import nextjsLib from 'next/package.json'
import makeSDK from '@xaiku/node'
import { XaikuProvider as ClientProvider } from '@xaiku/react'

const getState = cache(async (pkey, options = {}) => {
  const cookieStore = await cookies()
  const custom = {
    name: 'cookie',
    supported: true,
    get: key => cookieStore.get(key),
    set: (key, value) => cookieStore.set(key, value),
    delete: key => cookieStore.delete(key),
  }

  const sdk = makeSDK({
    pkey: pkey || process.env.NEXT_PUBLIC_XAIKU_API_KEY,
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
  sdk = sdk || (await getState(pkey, rest))

  const projects = await sdk.getProjects()

  return (
    <ClientProvider {...rest} store={{ name: 'cookie' }} pkey={pkey} projects={projects}>
      {children}
    </ClientProvider>
  )
}

export default Provider
