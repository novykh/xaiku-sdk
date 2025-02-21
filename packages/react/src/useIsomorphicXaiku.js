import React, {
  createContext,
  version,
  useCallback,
  useContext,
  useMemo,
  useLayoutEffect,
  useState,
} from 'react'

export default ({ sdk, pkey, ...rest }) => {
  const [loaded, setLoaded] = useState(false)
  const isomorphicClerk = useMemo(() => sdk || IsomorphicClerk.getOrCreateInstance(options), [])

  useEffect(() => {
    void isomorphicClerk.__unstable__updateProps({ appearance: options.appearance })
  }, [options.appearance])

  useEffect(() => {
    void isomorphicClerk.__unstable__updateProps({ options })
  }, [options.localization])

  useEffect(() => {
    isomorphicClerk.addOnLoaded(() => setLoaded(true))
  }, [])

  useEffect(() => {
    return () => {
      IsomorphicClerk.clearInstance()
      setLoaded(false)
    }
  }, [])

  return { isomorphicClerk, loaded }
}
