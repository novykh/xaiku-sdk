'use server'

import React from 'react'
import { cookies, headers } from 'next/headers'
import { XaikuProvider as ClientProvider } from '@xaiku/react'
import { guidStorageKey } from '@xaiku/shared'
import { HEADER_USER_ID, HEADER_ORG_ID } from './constants'
import makeSdk from './makeSdk'

const Provider = async ({
  children,
  pkey = process.env.NEXT_PUBLIC_XAIKU_API_KEY,
  userId: userIdProp,
  orgId: orgIdProp,
  sdk,
  ...rest
}) => {
  const cookieStore = await cookies()
  const headerStore = await headers()

  const userId = userIdProp ?? headerStore.get(HEADER_USER_ID)
  const orgId = orgIdProp ?? headerStore.get(HEADER_ORG_ID)

  let experiments
  try {
    sdk =
      sdk ||
      (await makeSdk({
        ...rest,
        pkey,
        userId,
        orgId,
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
      orgId={orgId}
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
