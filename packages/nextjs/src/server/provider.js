'use server'

import React from 'react'
import { cookies, headers } from 'next/headers'
import { XaikuProvider as ClientProvider } from '@xaiku/react'
import { guidStorageKey } from '@xaiku/shared'
import makeSDK from './makeSDK'

const Provider = async ({
  children,
  pkey = process.env.NEXT_PUBLIC_XAIKU_API_KEY,
  userId,
  sdk,
  ...rest
}) => {
  const cookieStore = await cookies()
  const headerStore = await headers()
  const testMode = headerStore.get('x-xaiku-test') === 'true'

  let experiments
  try {
    sdk =
      sdk ||
      (await makeSDK({
        ...rest,
        pkey,
        userId,
        guid: cookieStore.get(guidStorageKey)?.value || userId,
        testMode,
      }))

    experiments = await sdk.getExperiments()
  } catch (e) {
    console.log('CANNOT GET EXPERIMENTS', e)
  }

  return (
    <ClientProvider
      {...rest}
      userId={userId}
      pkey={pkey}
      guid={sdk?.guid}
      experiments={experiments}
    >
      {children}
    </ClientProvider>
  )
}

export default Provider
