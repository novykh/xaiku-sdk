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

  const testMode = cookieStore.get('xaiku_test')?.value === 'true'
  const requestHeaders = new Headers(request.headers)
  if (testMode) {
    requestHeaders.set('x-xaiku-test', 'true')
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  cookieStore.set(guidStorageKey, guid, {
    path: '/',
  })

  return response
}
