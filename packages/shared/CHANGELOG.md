# @xaiku/shared

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

## 0.0.7

### Patch Changes

- fcb869b: Upgrade npm packages

## 0.0.6

### Patch Changes

- e96e6c1: Fix lint issues.

## 0.0.5

### Patch Changes

- 2c9e835: Documentation.

## 0.0.4

### Patch Changes

- 85897eb: Sending events.

## 0.0.3

### Patch Changes

- defe646: Analytics hooks.

## 0.0.2

### Patch Changes

- 561c3fb: Add tests and fix text component!
- d0755bd: Introduced next js components.

## 0.0.1

### Patch Changes

- e7687ed: First release.
