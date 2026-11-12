import { useCallback, useEffect } from 'react'
import { useSdk } from './provider'

const trackedViews = new Set()

export const useTrackView = ({ experimentId, variantId, partId }) => {
  const sdk = useSdk()

  useEffect(() => {
    if (!sdk || !experimentId) return

    const send = () => {
      const selected = variantId ?? sdk.getSelectedVariantId(experimentId)
      if (!selected) return false

      const trackingKey = `${experimentId}:${selected}:${partId ?? 'experiment'}`
      if (!trackedViews.has(trackingKey)) {
        trackedViews.add(trackingKey)
        sdk.track.events.trackView({ experimentId, variantId: selected, partId })
      }
      return true
    }

    if (send()) return

    const off = sdk.on('variants:select', () => {
      if (send()) off()
    })
    return off
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
