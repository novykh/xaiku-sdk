'use client'

import makeSDK from '@xaiku/react'
import nextjsLib from 'next/package.json'

export {
  XaikuProvider,
  XaikuContext,
  Text,
  useText,
  useTrackView,
  useTrackClick,
  useTrackConversion,
  Project,
  useProjectId,
} from '@xaiku/react'

export default (options = {}) =>
  makeSDK({
    ...options,
    framework: 'nextjs',
    frameworkVersion: nextjsLib?.version || 'N/A',
  })
