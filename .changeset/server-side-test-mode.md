---
"@xaiku/shared": minor
"@xaiku/browser": minor
"@xaiku/nextjs": minor
---

Add server-side test mode support. Test mode now uses `sdk.options.testMode` as the single source of truth across browser and server environments. The browser SDK syncs localStorage to a cookie, Next.js middleware forwards it via request header, and the server provider passes it to the SDK. Added `setTestMode()` and `syncTestModeCookie()` helpers. Deprecated `isTestMode()`.
