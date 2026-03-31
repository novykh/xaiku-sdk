'use server'

import React from 'react'
import { cookies } from 'next/headers'
import { XaikuProvider as ClientProvider } from '@xaiku/react'
import { guidStorageKey } from '@xaiku/shared'
import makeSdk from './makeSdk'

const Provider = async ({
  children,
  pkey = process.env.NEXT_PUBLIC_XAIKU_API_KEY,
  userId,
  sdk,
  ...rest
}) => {
  const cookieStore = await cookies()

  let experiments
  try {
    sdk =
      sdk ||
      (await makeSdk({
        ...rest,
        pkey,
        userId,
        guid: cookieStore.get(guidStorageKey)?.value || userId,
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
      variants={sdk?.getVariants()}
    >
      {children}
    </ClientProvider>
  )
}

export default Provider
