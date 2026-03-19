'use client'

import {
  isValidElement,
  cloneElement,
  createElement,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react'
import { useSDK } from './provider'
import { useExperimentId } from './experiment'
import { useTrackView } from './useTrack'

const useForceUpdate = () => {
  const [, set] = useState(0)
  return useCallback(() => set(i => i + 1), [])
}

export const useText = (experimentId, id, fallback, control) => {
  const rerender = useForceUpdate()
  const sdk = useSDK()

  useLayoutEffect(() => {
    if (!sdk) return

    return sdk.on('variants:select', rerender)
  }, [sdk])

  if (!sdk) return fallback

  return sdk.getVariantText(experimentId, id, { control }) ?? fallback
}

export const Text = ({ id, experimentId, children, fallback, control }) => {
  const contextExperimentId = useExperimentId()
  experimentId = experimentId ?? contextExperimentId

  useTrackView({ experimentId, partId: id })

  if (!experimentId) {
    console.warn('No experimentId provided, falling back to fallback prop.')
    return fallback
  }

  fallback =
    fallback ??
    (isValidElement(children)
      ? children.props.children
      : typeof children === 'function'
        ? ''
        : (children ?? ''))

  const text = useText(experimentId, id, fallback, control)

  if (typeof children === 'function') return children(text)

  if (isValidElement(children))
    return cloneElement(
      children,
      { 'data-xaiku-experimentid': experimentId, 'data-xaiku-partid': id },
      text
    )

  return createElement(
    'span',
    { 'data-xaiku-experimentid': experimentId, 'data-xaiku-partid': id },
    text
  )
}
