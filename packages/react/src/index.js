'use client'

import makeSDK from '@xaiku/browser'
import { version } from 'react'

export { default as XaikuProvider, XaikuContext } from './provider'
export { default as Experiment, ExperimentContext, useExperimentId } from './experiment'
export { Text, useText } from './text'
export * from './useTrack'

export default (options = {}) =>
  makeSDK({ ...options, framework: 'react', frameworkVersion: version })
