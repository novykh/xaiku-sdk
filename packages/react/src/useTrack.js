import { useCallback, useEffect } from 'react'
import { useSdk } from './provider'

const trackedViews = new Set()

export const useTrackView = ({ experimentId, variantId, partId }) => {
  const sdk = useSdk()

  useEffect(() => {
    if (!sdk || !experimentId) return

    const actualVariantId = variantId || sdk.getVariantId(experimentId)
    const trackingKey = `${experimentId}:${actualVariantId}:${partId || 'default'}`

    if (trackedViews.has(trackingKey)) return

    sdk.track.events.trackView({
      experimentId,
      variantId: actualVariantId,
      partId,
    })

    trackedViews.add(trackingKey)
  }, [sdk, experimentId, variantId, partId])
}

export const useTrackClick = ({ experimentId, variantId, partId }) => {
  const sdk = useSdk()

  return useCallback(() => {
    if (!sdk || !experimentId) return

    sdk.track.events.trackClick({
      experimentId,
      variantId: variantId || sdk.getVariantId(experimentId),
      partId,
    })
  }, [sdk, experimentId, variantId, partId])
}

export const useTrackConversion = ({ experimentId, variantId, partId, value }) => {
  const sdk = useSdk()

  return useCallback(() => {
    if (!sdk || !experimentId) return

    sdk.track.events.trackConversion({
      experimentId,
      variantId: variantId || sdk.getVariantId(experimentId),
      partId,
      value,
    })
  }, [sdk, experimentId, variantId, partId, value])
}
