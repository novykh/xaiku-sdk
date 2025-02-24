'use client'

import { isValidElement, cloneElement, useCallback, useLayoutEffect, useState } from 'react'
import { useSDK } from './provider'
import { useProjectId } from './project'

const useForceUpdate = () => {
  const [, set] = useState(0)
  return useCallback(() => set(i => i + 1), [])
}

export const useText = (projectId, id, fallback) => {
  const rerender = useForceUpdate()
  const sdk = useSDK()

  useLayoutEffect(() => {
    if (!sdk) return

    return sdk.on('variants:select', rerender)
  }, [sdk])

  if (!sdk) return fallback

  return sdk.getVariantText(projectId, id) ?? fallback
}

export const Text = ({ id, projectId, children, fallback }) => {
  const contextProjectId = useProjectId()
  projectId = projectId ?? contextProjectId

  if (!projectId) {
    console.warn('No projectId provided, falling back to fallback prop.')
    return fallback
  }

  fallback =
    (fallback ?? isValidElement(children))
      ? children.props.children
      : typeof children === 'function'
        ? ''
        : children

  const text = useText(projectId, id, fallback)

  if (typeof children === 'function') return children(text)

  if (isValidElement(children)) return cloneElement(children, {}, text)

  return text
}
