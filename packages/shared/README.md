# @xaiku/shared

Core utilities and shared functionality for the Xaiku SDK ecosystem.

## Overview

The `@xaiku/shared` package provides foundational utilities used across all Xaiku SDK packages. It includes storage abstractions, event handling, performance monitoring, and common helpers.

## Installation

```bash
npm install @xaiku/shared
# or
pnpm add @xaiku/shared
```

> **Note**: This package is typically installed automatically as a dependency of other Xaiku packages.

## Core Modules

### Storage System
Pluggable storage abstraction supporting multiple backends:

```javascript
import { makeStorage, stores } from '@xaiku/shared'

// Initialize storage with preferred backend
const storage = makeStorage({
  store: { name: 'localStorage' } // or 'sessionStorage', 'cookie', 'memory'
})

// Use storage
await storage.set('key', { data: 'value' })
const data = await storage.get('key')
```

**Supported Storage Types:**
- `localStorage` - Browser local storage (persistent)
- `sessionStorage` - Browser session storage (tab-scoped)
- `cookie` - HTTP cookies with expiration
- `memory` - In-memory storage (session-scoped)
- `custom` - Your custom storage implementation

### Event System
Lightweight event emitter for SDK communication:

```javascript
import { makeListeners } from '@xaiku/shared'

const listeners = makeListeners()

// Subscribe to events
const unsubscribe = listeners.on('event:name', (data) => {
  console.log('Event received:', data)
})

// Emit events
listeners.trigger('event:name', { payload: 'data' })

// Cleanup
unsubscribe()
```

### Project Management
Variant selection and project handling:

```javascript
import { makeProjects, selectVariant } from '@xaiku/shared'

// Fetch projects from API
const projects = await makeProjects(sdk, ['project-1', 'project-2'])

// Select variant for user
const { selected, control } = selectVariant(
  variants,        // Array of variant objects
  userGuid,        // Unique user identifier
  projectId        // Project identifier
)
```

### Performance Monitoring
Web vitals and performance tracking:

```javascript
import { makePerformanceObserver } from '@xaiku/shared'

const observer = makePerformanceObserver((metrics) => {
  console.log('Performance metrics:', metrics)
  // metrics: { CLS, FCP, FID, LCP, TTFB, etc. }
})

// Start monitoring
observer.start()

// Stop monitoring
observer.stop()
```

### Request Utilities
HTTP request handling with error recovery:

```javascript
import { request, errorHandler } from '@xaiku/shared'

try {
  const response = await request('https://api.example.com/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' })
  })
} catch (error) {
  const handled = errorHandler(error)
  console.log('Handled error:', handled)
}
```

## Utility Functions

### Browser Detection
```javascript
import { isBrowser, hasDocument } from '@xaiku/shared'

if (isBrowser()) {
  // Browser-specific code
  const element = hasDocument() ? document.getElementById('app') : null
}
```

### Data Helpers
```javascript
import { 
  base64Encode, 
  base64Decode,
  getDataFromLocale,
  getGuid,
  ensureOneSlash,
  mergeRefs
} from '@xaiku/shared'

// Base64 encoding/decoding
const encoded = base64Encode('Hello World')
const decoded = base64Decode(encoded)

// Locale data extraction
const localeData = getDataFromLocale(navigator.language)

// Unique identifier generation
const guid = getGuid(sdkInstance)

// URL path normalization
const path = ensureOneSlash('/api/endpoint/')

// React ref merging
const combinedRef = mergeRefs(ref1, ref2, ref3)
```

### JSON Utilities
```javascript
import { safeJsonParse, safeJsonStringify } from '@xaiku/shared'

// Safe JSON parsing with fallbacks
const data = safeJsonParse('{"valid": "json"}', {})
const invalid = safeJsonParse('invalid json', { fallback: true })

// Safe JSON stringification
const str = safeJsonStringify({ circular: reference }, '{}')
```

### Timing Utilities
```javascript
import { onNextTick } from '@xaiku/shared'

// Execute on next event loop tick
onNextTick(() => {
  console.log('Executed on next tick')
})
```

## Storage Backends

### localStorage Backend
```javascript
import { localStorage } from '@xaiku/shared/storage'

const store = localStorage()
await store.set('key', 'value')
const value = await store.get('key')
```

### sessionStorage Backend
```javascript
import { sessionStorage } from '@xaiku/shared/storage'

const store = sessionStorage()
await store.set('session-key', { data: 'session-scoped' })
```

### Cookie Backend
```javascript
import { cookie } from '@xaiku/shared/storage'

const store = cookie()
await store.set('cookie-key', 'value', { 
  expires: new Date(Date.now() + 86400000) // 24 hours
})
```

### Memory Backend
```javascript
import { memory } from '@xaiku/shared/storage'

const store = memory()
await store.set('memory-key', 'value') // Lost on page refresh
```

### Custom Storage Implementation
```javascript
// Implement custom storage backend
const customStorage = {
  async get(key) {
    // Your get implementation
    return await myDatabase.get(key)
  },
  
  async set(key, value, options = {}) {
    // Your set implementation
    return await myDatabase.set(key, value, options)
  },
  
  async remove(key) {
    // Your remove implementation
    return await myDatabase.remove(key)
  },
  
  async clear() {
    // Your clear implementation
    return await myDatabase.clear()
  }
}

const storage = makeStorage({ 
  store: { name: 'custom', custom: customStorage } 
})
```

## Performance Utilities

### Metric Collection
```javascript
import { 
  getCLS,    // Cumulative Layout Shift
  getFCP,    // First Contentful Paint
  getFID,    // First Input Delay
  getLCP,    // Largest Contentful Paint
  getTTFB    // Time to First Byte
} from '@xaiku/shared/metrics'

// Collect individual metrics
getCLS((metric) => console.log('CLS:', metric.value))
getFCP((metric) => console.log('FCP:', metric.value))
getFID((metric) => console.log('FID:', metric.value))
getLCP((metric) => console.log('LCP:', metric.value))
getTTFB((metric) => console.log('TTFB:', metric.value))
```

### Navigation Timing
```javascript
import { getInitialNavEntry } from '@xaiku/shared'

const navTiming = getInitialNavEntry()
console.log('Navigation timing:', {
  loadTime: navTiming.loadEventEnd - navTiming.navigationStart,
  domReady: navTiming.domContentLoadedEventEnd - navTiming.navigationStart
})
```

## Type Definitions

The package includes comprehensive TypeScript definitions:

```typescript
import type { 
  Storage,
  StorageOptions,
  EventListeners,
  PerformanceMetric,
  ProjectConfig,
  VariantConfig
} from '@xaiku/shared'
```

## Architecture

### Module Structure
```
@xaiku/shared/
├── src/
│   ├── storage/           # Storage backends
│   ├── request/           # HTTP utilities
│   ├── metrics/           # Performance monitoring
│   ├── projects/          # A/B testing logic
│   ├── track/            # Event tracking
│   └── types/            # TypeScript definitions
```

### Key Design Principles

1. **Framework Agnostic** - Works in any JavaScript environment
2. **Tree Shakable** - Import only what you need
3. **TypeScript First** - Comprehensive type definitions
4. **Performance Focused** - Minimal runtime overhead
5. **Extensible** - Plugin architecture for custom implementations

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 60+, Safari 12+)
- **Legacy Support**: Graceful degradation with polyfills
- **Node.js**: Server-side rendering compatible
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+

## Usage Examples

### SDK Integration
```javascript
import { 
  makeStorage,
  makeListeners, 
  makePerformanceObserver,
  makeProjects
} from '@xaiku/shared'

function createSDK(options) {
  const storage = makeStorage(options.storage)
  const listeners = makeListeners()
  const performance = makePerformanceObserver()
  const projects = makeProjects()

  return {
    storage,
    listeners,
    performance,
    projects,
    // Other SDK functionality
  }
}
```

### Custom Storage with Encryption
```javascript
import { makeStorage, base64Encode, base64Decode } from '@xaiku/shared'

const encryptedStorage = {
  async get(key) {
    const encrypted = localStorage.getItem(key)
    if (!encrypted) return null
    return JSON.parse(base64Decode(encrypted))
  },
  
  async set(key, value) {
    const encrypted = base64Encode(JSON.stringify(value))
    localStorage.setItem(key, encrypted)
  },
  
  async remove(key) {
    localStorage.removeItem(key)
  },
  
  async clear() {
    localStorage.clear()
  }
}

const storage = makeStorage({ 
  store: { name: 'custom', custom: encryptedStorage } 
})
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build package
pnpm build

# Type checking
pnpm type-check
```

## Testing

The package includes comprehensive test suites:

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test storage
pnpm test metrics
pnpm test projects
```

## API Reference

See the [full API documentation](./docs/API.md) for detailed information about all exported functions, types, and interfaces.