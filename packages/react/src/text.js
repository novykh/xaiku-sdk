'use client'

import {
  isValidElement,
  cloneElement,
  useCallback,
  useMemo,
  useLayoutEffect,
  useState,
} from 'react'
import { useSDK } from './provider'
import { useProjectId } from './project'

const useForceUpdate = () => {
  const [, set] = useState(0)
  return useCallback(() => set(i => i + 1), [])
}

export const useText = (projectId, id, fallback = '') => {
  const rerender = useForceUpdate()
  const sdk = useSDK()

  useLayoutEffect(() => {
    if (!sdk) return

    return sdk.on('variants:select', rerender)
  }, [sdk])

  if (!sdk) return fallback

  return sdk.getVariantText(projectId, id) || fallback
}

export const Text = ({
  id,
  projectId,
  children,
  fallback = typeof children === 'function' ? '' : children,
}) => {
  const contextProjectId = useProjectId()
  projectId = projectId ?? contextProjectId

  if (!projectId) {
    console.warn('No projectId provided, falling back to fallback provided.')
    return fallback
  }

  const text = useText(projectId, id, fallback)

  if (typeof children === 'function') return children(text)

  if (isValidElement(children)) return cloneElement(children, { children: text })

  return text
}
