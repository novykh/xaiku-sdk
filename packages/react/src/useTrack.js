import { useCallback, useEffect } from 'react'
import { useSDK } from './provider'

export const useTrackView = ({ projectId, variantId, partId }) => {
  const sdk = useSDK()

  useEffect(() => {
    if (!sdk || !projectId) return
    console.log(projectId, sdk.getVariantId(projectId), partId)
    sdk.track.events.trackView({
      projectId,
      variantId: variantId || sdk.getVariantId(projectId),
      partId,
    })
  }, [!!sdk && !!projectId])
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
  }, [!!sdk && !!projectId])
}
