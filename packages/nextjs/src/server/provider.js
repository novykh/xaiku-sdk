'use server'

import React from 'react'
import { cookies } from 'next/headers'
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

  let projects
  try {
    sdk =
      sdk ||
      (await makeSDK({
        ...rest,
        pkey,
        userId,
        guid: cookieStore.get(guidStorageKey)?.value || userId,
      }))

    projects = await sdk.getProjects()
  } catch (e) {
    console.log('CANNOT GET PROJECTS', e)
  }

  return (
    <ClientProvider {...rest} userId={userId} pkey={pkey} guid={sdk?.guid} projects={projects}>
      {children}
    </ClientProvider>
  )
}

export default Provider
