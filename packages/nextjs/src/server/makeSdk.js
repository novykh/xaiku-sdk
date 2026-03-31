import { cookies } from 'next/headers'
import makeSdk from '@xaiku/node'
import nextjsLib from 'next/package.json'

export default async (options = {}) => {
  const cookieStore = await cookies()
  const testMode = cookieStore.get('xaiku_test')?.value === 'true'

  return makeSdk({
    ...options,
    pkey: options.pkey ?? process.env.NEXT_PUBLIC_XAIKU_API_KEY,
    framework: 'nextjs',
    frameworkVersion: nextjsLib?.version || 'N/A',
    skipClient: true,
    skipExperiments: true,
    testMode: options.testMode ?? testMode,
  })
}
