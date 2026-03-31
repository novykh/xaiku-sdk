# @xaiku/nextjs

## 1.2.0

### Minor Changes

- 00bc6c3: `makeSdk` (server) now auto-detects `testMode` from the `xaiku_test` cookie — no need to pass it explicitly. Middleware no longer relays the `x-xaiku-test` header. Server provider passes pre-fetched `variants` to the client provider to support SSR hydration.

### Patch Changes

- Updated dependencies [00bc6c3]
  - @xaiku/react@1.1.0
  - @xaiku/node@1.0.2

## 1.1.0

### Minor Changes

- 48d0258: Add server-side test mode support. Test mode now uses `sdk.options.testMode` as the single source of truth across browser and server environments. The browser SDK syncs localStorage to a cookie, Next.js middleware forwards it via request header, and the server provider passes it to the SDK. Added `setTestMode()` and `syncTestModeCookie()` helpers. Deprecated `isTestMode()`.

### Patch Changes

- @xaiku/node@1.0.1
- @xaiku/react@1.0.1

## 1.0.0

### Major Changes

- 66e325f: Rename project to experiment across all packages.

  ### What changed

  All public APIs, components, hooks, events, and storage keys renamed from `project`/`projects` to `experiment`/`experiments`.

  ### Why

  The domain term "project" was confusing — Xaiku runs A/B testing experiments, not projects. The word "project" is reserved for a future grouping/folder concept.

  ### Breaking changes
  - `@xaiku/shared`: `setProjects` → `setExperiments`, `getProjects` → `getExperiments`, `skipProjects` → `skipExperiments`, `projects:fetched` → `experiments:fetched` event, storage key `__xaiku__projects__` → `__xaiku__experiments__`
  - `@xaiku/react`: `<Project>` → `<Experiment>`, `ProjectContext` → `ExperimentContext`, `useProjectId` → `useExperimentId`, `data-xaiku-projectid` → `data-xaiku-experimentid`
  - `@xaiku/nextjs`: re-exports updated (`Experiment`, `useExperimentId`), server provider uses `getExperiments()` and `skipExperiments`
  - `@xaiku/core`, `@xaiku/browser`, `@xaiku/node`: internal experiment references updated
  - API endpoint: `/api/v1/projects` → `/api/v1/experiments`

  ### How to migrate
  1. Find and replace in your code:
     - `<Project` → `<Experiment`
     - `useProjectId` → `useExperimentId`
     - `ProjectContext` → `ExperimentContext`
     - `setProjects` → `setExperiments`
     - `getProjects` → `getExperiments`
     - `skipProjects: true` → `skipExperiments: true`
  2. Update event listeners: `sdk.on('projects:fetched', ...)` → `sdk.on('experiments:fetched', ...)`
  3. Update HTML attribute selectors: `[data-xaiku-projectid]` → `[data-xaiku-experimentid]`
  4. Clear local storage key `__xaiku__projects__` (now `__xaiku__experiments__`)

### Patch Changes

- Updated dependencies [66e325f]
  - @xaiku/react@1.0.0
  - @xaiku/node@1.0.0

## 0.0.7

### Patch Changes

- fcb869b: Upgrade npm packages
- Updated dependencies [fcb869b]
  - @xaiku/react@0.0.7
  - @xaiku/node@0.0.7

## 0.0.6

### Patch Changes

- e96e6c1: Fix lint issues.
- Updated dependencies [e96e6c1]
  - @xaiku/react@0.0.6
  - @xaiku/node@0.0.6

## 0.0.5

### Patch Changes

- af7afb0: Upgrade packages.
- 2c9e835: Documentation.
- dce1926: Minor fix.
- Updated dependencies [af7afb0]
- Updated dependencies [2c9e835]
  - @xaiku/react@0.0.5
  - @xaiku/node@0.0.5

## 0.0.4

### Patch Changes

- 85897eb: Sending events.
- a04cbc5: Cleanup.
- Updated dependencies [85897eb]
- Updated dependencies [a04cbc5]
  - @xaiku/node@0.0.4
  - @xaiku/react@0.0.4

## 0.0.3

### Patch Changes

- eaa7570: Fix: DynamicServerError.
- 008979d: Rollback: Try fixing DynamicServerError, but still including try-catch on sdk specific functions.
- defe646: Analytics hooks.
- Updated dependencies [defe646]
  - @xaiku/react@0.0.3
  - @xaiku/node@0.0.3

## 0.0.2

### Patch Changes

- 561c3fb: Add tests and fix text component!
- d0755bd: Introduced next js components.
- Updated dependencies [561c3fb]
- Updated dependencies [d0755bd]
  - @xaiku/node@0.0.2
  - @xaiku/react@0.0.2

## 0.0.1

### Patch Changes

- e7687ed: First release.
- Updated dependencies [e7687ed]
  - @xaiku/node@0.0.1
  - @xaiku/react@0.0.1
