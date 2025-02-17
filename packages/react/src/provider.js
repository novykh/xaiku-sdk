import React, {
  createContext,
  version,
  useCallback,
  useContext,
  useMemo,
  useLayoutEffect,
  useState,
} from 'react'
import browserSDK from '@xaiku/browser'

export const XaikuContext = createContext(null)

export const useSDK = () => useContext(XaikuContext)

const useForceUpdate = () => {
  const [, set] = useState(0)
  return useCallback(() => set(i => i + 1), [])
}

export const useVariantPart = (projectId, partId, initialValue = '') => {
  const [part, setPart] = useState(initialValue)
  const sdk = useSDK()

  const off = useMemo(() => {
    if (!sdk) return

    return sdk.on('variants:select', variant => {
      sdk.getVariant(projectId, partId).then(value => {
        console.log('selected', value, variant)
        setPart(value)
      })
    })
  }, [sdk])

  useLayoutEffect(() => off, [off])

  return part
}

const Provider = ({ children, pkey, sdk, ...rest }) => {
  const memoizedSdk = useMemo(
    () => sdk || browserSDK({ ...rest, pkey, framework: 'react', frameworkVersion: version }),
    [sdk, pkey]
  )

  return <XaikuContext.Provider value={memoizedSdk}>{children}</XaikuContext.Provider>
}

export default Provider
