---
'@xaiku/browser': major
'@xaiku/nextjs': major
'@xaiku/shared': major
'@xaiku/react': major
'@xaiku/core': major
'@xaiku/docs': major
'@xaiku/node': major
---

Rename project to experiment across all packages.

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
