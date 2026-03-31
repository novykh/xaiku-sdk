'use client'

import makeSdk from '@xaiku/browser'
import { version } from 'react'

export { default as XaikuProvider, XaikuContext } from './provider'
export { default as Experiment, ExperimentContext, useExperimentId } from './experiment'
export { Text, useText } from './text'
export * from './useTrack'

export default (options = {}) =>
  makeSdk({ ...options, framework: 'react', frameworkVersion: version })
