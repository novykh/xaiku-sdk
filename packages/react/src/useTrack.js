import { useCallback, useEffect } from 'react'
import { useSDK } from './provider'

const trackedViews = new Set()

export const useTrackView = ({ projectId, variantId, partId }) => {
  const sdk = useSDK()

  useEffect(() => {
    if (!sdk || !projectId) return

    const actualVariantId = variantId || sdk.getVariantId(projectId)
    const trackingKey = `${projectId}:${actualVariantId}:${partId || 'default'}`

    if (trackedViews.has(trackingKey)) return

    sdk.track.events.trackView({
      projectId,
      variantId: actualVariantId,
      partId,
    })

    trackedViews.add(trackingKey)
  }, [sdk, projectId, variantId, partId])
}

export const useTrackClick = ({ projectId, variantId, partId }) => {
  const sdk = useSDK()

  return useCallback(() => {
    if (!sdk || !projectId) return

    sdk.track.events.trackClick({
      projectId,
      variantId: variantId || sdk.getVariantId(projectId),
      partId,
    })
  }, [sdk, projectId, variantId, partId])
}

export const useTrackConversion = ({ projectId, variantId, partId, value }) => {
  const sdk = useSDK()

  return useCallback(() => {
    if (!sdk || !projectId) return

    sdk.track.events.trackConversion({
      projectId,
      variantId: variantId || sdk.getVariantId(projectId),
      partId,
      value,
    })
  }, [sdk, projectId, variantId, partId, value])
}
