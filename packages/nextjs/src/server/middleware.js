import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import makeSDK from './makeSDK'

export default async () => {
  const cookieStore = await cookies()
  let guid = cookieStore.get('__xaiku__guid__')?.value

  try {
    if (!guid) {
      const sdk = await makeSDK({ pkey: process.env.NEXT_PUBLIC_XAIKU_API_KEY })
      guid = sdk.guid
    }
  } catch (e) {
    console.error(e)
  }

  const response = NextResponse.next()

  cookieStore.set('__xaiku__guid__', guid, {
    path: '/',
  })

  return response
}
