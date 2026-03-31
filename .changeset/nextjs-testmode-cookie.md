---
"@xaiku/nextjs": minor
---

`makeSdk` (server) now auto-detects `testMode` from the `xaiku_test` cookie — no need to pass it explicitly. Middleware no longer relays the `x-xaiku-test` header. Server provider passes pre-fetched `variants` to the client provider to support SSR hydration.
