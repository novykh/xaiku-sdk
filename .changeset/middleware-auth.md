---
'@xaiku/nextjs': minor
'@xaiku/docs': patch
---

Add auth support to middleware for passing userId and orgId to the server provider via request headers. The provider reads these automatically when not passed as props, keeping layouts free of auth logic.
