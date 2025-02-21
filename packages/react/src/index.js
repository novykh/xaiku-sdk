'use client'

import makeSDK from '@xaiku/browser'
import { version } from 'react'

export { default as XaikuProvider, XaikuContext } from './provider'
export { default as Project, ProjectContext, useProjectId } from './project'
export { Text, useText } from './text'

export default (options = {}) =>
  makeSDK({ ...options, framework: 'react', frameworkVersion: version })
