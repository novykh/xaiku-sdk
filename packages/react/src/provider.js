import React, {
  createContext,
  version,
  useCallback,
  useContext,
  useMemo,
  useLayoutEffect,
  useState,
} from 'react'
import makeSDK from '@xaiku/browser'

export const XaikuContext = createContext(null)

export const useSDK = () => useContext(XaikuContext)

const useForceUpdate = () => {
  const [, set] = useState(0)
  return useCallback(() => set(i => i + 1), [])
}

export const useText = (projectId, partId, initialValue = '') => {
  const rerender = useForceUpdate()
  const sdk = useSDK()

  const off = useMemo(() => {
    if (!sdk) return

    return sdk.on('variants:select', rerender)
  }, [sdk])

  useLayoutEffect(() => off, [off])

  return sdk.getVariant(projectId, partId) || initialValue
}

export const Text = ({ projectId, partId, children }) => {
  // TODO if element, then clone and pass correctly the text in it
  const text = useText(projectId, partId, children)

  return text
}

const Provider = ({ children, pkey, sdk, ...rest }) => {
  const memoizedSdk = useMemo(
    () => sdk || makeSDK({ pkey, framework: 'react', frameworkVersion: version, ...rest }),
    [sdk, pkey]
  )

  return <XaikuContext.Provider value={memoizedSdk}>{children}</XaikuContext.Provider>
}

export default Provider
