import { NextResponse } from 'next/server'
import { guidStorageKey } from '@xaiku/shared'
import { HEADER_USER_ID, HEADER_ORG_ID } from './constants'
import makeSdk from './makeSdk'

export default async (request, options = {}) => {
  const { auth, userId: userIdOpt, orgId: orgIdOpt, ...sdkOptions } = options

  let userId = userIdOpt
  let orgId = orgIdOpt

  if (auth) {
    const result = await auth(request)
    userId = result?.userId ?? userId
    orgId = result?.orgId ?? orgId
  }

  let guid = request.cookies.get(guidStorageKey)?.value

  try {
    const sdk = await makeSdk({
      pkey: process.env.NEXT_PUBLIC_XAIKU_API_KEY,
      guid,
      userId,
      orgId,
      ...sdkOptions,
    })
    guid = sdk.guid
  } catch (e) {
    console.error('Xaiku middleware error:', e)
  }

  const requestHeaders = new Headers(request.headers)
  if (userId) requestHeaders.set(HEADER_USER_ID, userId)
  if (orgId) requestHeaders.set(HEADER_ORG_ID, orgId)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  response.cookies.set(guidStorageKey, guid, { path: '/' })

  return response
}
