import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { guidStorageKey } from '@xaiku/shared'
import makeSDK from './makeSDK'

export default async (request, options = {}) => {
  const cookieStore = await cookies()
  let guid = cookieStore.get(guidStorageKey)?.value

  try {
    const sdk = await makeSDK({ pkey: process.env.NEXT_PUBLIC_XAIKU_API_KEY, guid, ...options })
    guid = sdk.guid
  } catch (e) {
    console.error('Xaiku middleware error:', e)
  }

  const response = NextResponse.next()

  cookieStore.set(guidStorageKey, guid, {
    path: '/',
  })

  return response
}
