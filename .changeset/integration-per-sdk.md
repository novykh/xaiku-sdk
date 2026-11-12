---
"@xaiku/agent-plugin": patch
---

`integrating-the-sdk` says what each SDK records: React and Next.js record the view automatically and use `useTrackConversion`; the browser SDK records the view inside `experiments:fetched` and uses `trackConversion`; Node records neither. It names the minimum SDK versions that count views correctly.
