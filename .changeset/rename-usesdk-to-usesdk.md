---
"@xaiku/react": minor
---

Rename `useSDK` export to `useSdk` for consistent naming convention. Add SDK instance cleanup on provider unmount. Switch from `useLayoutEffect` to `useEffect` in `useText` for SSR compatibility. Provider now accepts `variants` prop to support server-side pre-fetched variants.
