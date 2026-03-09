# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Xaiku SDK is a monorepo containing multiple JavaScript packages for analytics and tracking, built with a modern Node.js and pnpm workspace architecture. The SDK provides browser tracking capabilities, React integration, Next.js support, and core analytics functionality.

## Package Architecture

The monorepo follows a layered dependency structure:

- **@xaiku/shared**: Core utilities and helpers (base64, storage, listeners, performance observers)
- **@xaiku/core**: Main SDK factory and client implementation, depends on shared
- **@xaiku/browser**: Browser-specific tracking (DOM proxy, metrics like CLS/FCP/LCP), depends on core + shared
- **@xaiku/react**: React components and hooks (providers, useTrack), depends on browser
- **@xaiku/nextjs**: Next.js middleware and server utilities, depends on shared
- **@xaiku/node**: Node.js server implementation, depends on shared
- Configuration packages: babel-config, eslint-config, prettier-config

## Development Commands

### Root Level (from project root)
- `pnpm build` - Build all packages
- `pnpm test` - Run tests across all packages
- `pnpm lint` - Lint all packages
- `pnpm clean` - Clean all package dist folders
- `pnpm format` - Format code with Prettier

### Package Level Commands
Navigate to any package directory (e.g., `packages/react/`) and run:
- `pnpm build` - Builds both CJS and ESM versions
- `pnpm test` - Run Jest tests
- `pnpm lint` - ESLint checking
- `pnpm storybook` - Start Storybook (browser/react packages)

### Specialized Commands
- `pnpm changes` - Create changesets for versioning
- `pnpm version` - Apply changesets
- `pnpm release` - Publish packages

## Build System

Uses Babel for transpilation with dual builds:
- CommonJS: `dist/index.js` 
- ES Modules: `dist/es6/index.js`

Build process: `babel src -d dist` + TypeScript compilation for type definitions

## Testing

- Jest for unit testing with jsdom environment
- React Testing Library for React components
- MSW (Mock Service Worker) for API mocking in some packages
- Coverage reports generated in `coverage/` directories

## Key Implementation Patterns

1. **Workspace Dependencies**: Uses `workspace:*` for internal package dependencies
2. **Catalog System**: pnpm workspace catalogs for version management of common dependencies
3. **Dual Export**: All packages export both CJS and ESM formats
4. **Proxy Pattern**: Heavy use of proxy functions for event handling and DOM interception
5. **Storage Abstraction**: Pluggable storage system (memory, localStorage, sessionStorage, cookie)

## TypeScript Configuration

Each package has its own `tsconfig.json`. TypeScript is primarily used for type definitions (`*.d.ts` files) rather than source compilation.