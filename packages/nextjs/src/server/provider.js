import React from 'react'
import ClientProvider from '../client/provider'

const getState = React.cache(async () => {
  const data = getData()

  return data
})

const Provider = async ({ children, ...rest }) => {
  return (
    <ClientProvider
      apiKey={process.env.NEXT_PUBLIC_XAIKU_API_KEY}
      {...rest}
      initialState={rest.initialState || (await getState())}
    >
      {children}
    </ClientProvider>
  )
}

export default Provider
