import {cookies} from "next/headers"
import React from 'react'
import ClientProvider from '../client/provider'
import makeSDK from '@xaiku/node'

const getState = React.cache(async () => {
  const cookieStore = await cookies()
  const custom = {
    name: "cookie",
    supported: true,
    get: (key) => cookieStore.get(key),
    set: (key, value) => cookieStore.set(key, value),
    delete: (key) => cookieStore.delete(key)
  }

  const sdk = makeSDK({
    pkey: process.env.NEXT_PUBLIC_XAIKU_API_KEY,
    store: {custom}
  })

  const projects = await fetchProjects(sdk)
  return { projects }
})

const Provider = async ({ children, ...rest }) => {
  const initialState = rest.initialState || (await getState())

  return (
    <ClientProvider
      apiKey={process.env.NEXT_PUBLIC_XAIKU_API_KEY}
      {...rest}
      initialState={initialState}
    >
      {children}
    </ClientProvider>
  )
}

export default Provider