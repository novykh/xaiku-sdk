'use server'

import React from 'react'
import nextjsLib from 'next/package.json'
import { cookies } from 'next/headers'
import makeSDK from '@xaiku/node'
import { XaikuProvider as ClientProvider } from '@xaiku/react'
import { guidStorageKey } from '@xaiku/shared'

const Provider = async ({
  children,
  pkey = process.env.NEXT_PUBLIC_XAIKU_API_KEY,
  userId,
  sdk,
  ...rest
}) => {
  let projects
  try {
    const cookieStore = await cookies()
    if (!userId) console.warn('Missing userId')
    sdk =
      sdk ||
      (await makeSDK({
        ...rest,
        pkey,
        framework: 'nextjs',
        frameworkVersion: nextjsLib?.version || 'N/A',
        skipClient: true,
        guid: cookieStore.get(guidStorageKey || userId),
      }))

    projects = await sdk.getProjects()
  } catch (e) {
    console.log('CANNOT GET PROJECTS', e)
  }

  return (
    <ClientProvider {...rest} store={{ name: 'cookie' }} pkey={pkey} projects={projects}>
      {children}
    </ClientProvider>
  )
}

export default Provider
