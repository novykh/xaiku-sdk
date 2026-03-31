'use client'

import makeSdk from '@xaiku/react'
import nextjsLib from 'next/package.json'

export {
  XaikuProvider,
  XaikuContext,
  Text,
  useText,
  useTrackView,
  useTrackClick,
  useTrackConversion,
  Experiment,
  useExperimentId,
} from '@xaiku/react'

export default (options = {}) =>
  makeSdk({
    ...options,
    framework: 'nextjs',
    frameworkVersion: nextjsLib?.version || 'N/A',
  })
