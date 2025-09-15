# Performance Optimizations

Production-ready performance optimizations and monitoring tools for high-traffic applications.

## Overview

The Xaiku SDK includes built-in performance optimizations and monitoring tools designed for enterprise-scale applications. These features ensure minimal impact on user experience while providing comprehensive analytics.

## Built-in Optimizations

### Automatic Deduplication
Prevents duplicate event tracking across component re-renders:

```jsx
// This won't create duplicate impressions on re-renders
function MyComponent() {
  useTrackView({ projectId: "test", partId: "component" })
  return <div>Content</div>
}
```

### Event Batching
Groups multiple events for efficient transmission:

```jsx
import { useBatchedTracking } from '@xaiku/react'

function HighVolumeComponent() {
  const sdk = useSDK()
  const addToBatch = useBatchedTracking(
    sdk, 
    10,    // Batch size
    5000   // Flush interval (ms)
  )

  const handleMultipleEvents = () => {
    addToBatch({ type: 'click', target: 'button1' })
    addToBatch({ type: 'hover', target: 'button2' })
    // Events are batched and sent together
  }

  return <button onClick={handleMultipleEvents}>Track Events</button>
}
```

## Performance Monitoring Hooks

### usePerformanceOptimization
Monitors component performance and provides optimization recommendations:

```jsx
import { usePerformanceOptimization } from '@xaiku/react'

function OptimizedComponent() {
  const {
    recordRenderTime,
    recordMemoryUsage,
    getOptimizationRecommendations,
    metrics
  } = usePerformanceOptimization()

  useEffect(() => {
    const startTime = performance.now()
    
    // Your component logic here
    
    const renderTime = performance.now() - startTime
    recordRenderTime(renderTime)
    recordMemoryUsage()

    // Check for recommendations
    const recommendations = getOptimizationRecommendations()
    if (recommendations.length > 0) {
      console.log('Performance recommendations:', recommendations)
    }
  })

  return <div>Optimized content</div>
}
```

**Metrics Tracked:**
- Render time trends
- Memory usage patterns  
- Event frequency
- Performance bottlenecks

**Automatic Recommendations:**
- "Consider using React.memo for expensive calculations"
- "Memory usage trending upward - check for memory leaks"
- "Consider throttling high-frequency events"

### useAdaptiveTracking
Adjusts tracking based on device capabilities and network conditions:

```jsx
import { useAdaptiveTracking } from '@xaiku/react'

function AdaptiveComponent() {
  const {
    getTrackingStrategy,
    shouldTrackEvent,
    capabilities
  } = useAdaptiveTracking()

  const handleEvent = (eventType) => {
    if (shouldTrackEvent(eventType)) {
      // Track the event
      trackEvent(eventType)
    } else {
      // Skip tracking on low-end devices
      console.log(`Skipping ${eventType} on low-end device`)
    }
  }

  const strategy = getTrackingStrategy() // 'full', 'reduced', or 'minimal'

  return (
    <div>
      <p>Tracking Strategy: {strategy}</p>
      <p>Device Capabilities:</p>
      <ul>
        <li>CPU Cores: {capabilities?.isLowEndDevice ? '≤2' : '>2'}</li>
        <li>Memory: {capabilities?.isLowMemory ? '≤2GB' : '>2GB'}</li>
        <li>Connection: {capabilities?.isSlowConnection ? 'Slow' : 'Fast'}</li>
        <li>Battery: {capabilities?.isBatteryLow ? 'Low' : 'Normal'}</li>
      </ul>
    </div>
  )
}
```

**Tracking Strategies:**
- **Full**: All tracking enabled (default)
- **Reduced**: Skip non-essential events (scroll, hover, performance)
- **Minimal**: Only critical events (impressions, conversions)

## Event Optimization Hooks

### useDebounced
Debounces high-frequency events to reduce noise:

```jsx
import { useDebounced } from '@xaiku/react'

function SearchComponent() {
  const [query, setQuery] = useState('')
  
  const debouncedTrackSearch = useDebounced((searchTerm) => {
    trackEvent('search', { query: searchTerm })
  }, 300) // 300ms delay

  const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
    debouncedTrackSearch(value) // Only tracks after user stops typing
  }

  return <input onChange={handleSearch} value={query} />
}
```

### useThrottled
Throttles events to limit frequency:

```jsx
import { useThrottled } from '@xaiku/react'

function ScrollTracker() {
  const throttledScrollTrack = useThrottled((scrollPosition) => {
    trackEvent('scroll', { position: scrollPosition })
  }, 100) // Maximum once per 100ms

  useEffect(() => {
    const handleScroll = () => {
      throttledScrollTrack(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [throttledScrollTrack])

  return <div>Content that tracks scroll</div>
}
```

## Memory Management

### useMemoryEfficientTracking
Implements LRU caching to prevent memory bloat:

```jsx
import { useMemoryEfficientTracking } from '@xaiku/react'

function CachedTracker() {
  const {
    addToCache,
    getFromCache,
    clearCache,
    cacheSize
  } = useMemoryEfficientTracking(1000) // Max 1000 entries

  const trackWithCache = (eventId, eventData) => {
    const cached = getFromCache(eventId)
    if (cached) {
      console.log('Using cached event data')
      return
    }

    addToCache(eventId, eventData)
    trackEvent(eventId, eventData)
  }

  return (
    <div>
      <p>Cache Size: {cacheSize}/1000</p>
      <button onClick={clearCache}>Clear Cache</button>
    </div>
  )
}
```

## Production Configuration

### Optimal SDK Setup

```jsx
import { XaikuProvider } from '@xaiku/react'

function App() {
  return (
    <XaikuProvider
      apiUrl="https://api.xaiku.com"
      pkey="your-public-key"
      // Performance optimizations
      batchSize={25}           // Larger batches for high traffic
      batchTimeout={3000}      // Shorter timeout for real-time data
      enableCompression={true} // Compress payloads
      enableRetries={true}     // Retry failed requests
      maxRetries={3}
      retryDelay={1000}
      // Development vs production
      debug={process.env.NODE_ENV === 'development'}
    >
      <MyApp />
    </XaikuProvider>
  )
}
```

### Environment-Specific Optimizations

```jsx
// Development: Full tracking with debug info
const developmentConfig = {
  trackingStrategy: 'full',
  debug: true,
  batchSize: 1,        // Immediate sending for debugging
  enableLogging: true
}

// Production: Optimized for performance
const productionConfig = {
  trackingStrategy: 'adaptive', // Adapts to device capabilities
  debug: false,
  batchSize: 50,       // Larger batches
  batchTimeout: 5000,  // Longer timeout
  enableCompression: true,
  enableServiceWorker: true // Use service worker for background processing
}

const config = process.env.NODE_ENV === 'production' 
  ? productionConfig 
  : developmentConfig
```

## Performance Monitoring Dashboard

### Real-time Performance Metrics

```jsx
import { 
  usePerformanceOptimization, 
  useAdaptiveTracking 
} from '@xaiku/react'

function PerformanceDashboard() {
  const { metrics, getOptimizationRecommendations } = usePerformanceOptimization()
  const { capabilities, getTrackingStrategy } = useAdaptiveTracking()

  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      setRecommendations(getOptimizationRecommendations())
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [getOptimizationRecommendations])

  return (
    <div className="performance-dashboard">
      <h3>Performance Metrics</h3>
      <div className="metrics">
        <div>Avg Render Time: {
          metrics.renderTimes.length > 0 
            ? (metrics.renderTimes.reduce((a, b) => a + b) / metrics.renderTimes.length).toFixed(2)
            : 0
        }ms</div>
        <div>Event Count: {metrics.eventCounts}</div>
        <div>Memory Samples: {metrics.memoryUsage.length}</div>
        <div>Tracking Strategy: {getTrackingStrategy()}</div>
      </div>

      <h3>Device Capabilities</h3>
      <div className="capabilities">
        <div>Low-end Device: {capabilities?.isLowEndDevice ? 'Yes' : 'No'}</div>
        <div>Slow Connection: {capabilities?.isSlowConnection ? 'Yes' : 'No'}</div>
        <div>Low Memory: {capabilities?.isLowMemory ? 'Yes' : 'No'}</div>
        <div>Low Battery: {capabilities?.isBatteryLow ? 'Yes' : 'No'}</div>
      </div>

      <h3>Optimization Recommendations</h3>
      <ul className="recommendations">
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Bundle Size Optimization

### Tree Shaking
Import only what you need:

```jsx
// Good - tree shaking friendly
import { Text, useTrackClick } from '@xaiku/react'

// Avoid - imports entire package
import * as Xaiku from '@xaiku/react'
```

### Code Splitting
Lazy load advanced features:

```jsx
import { lazy, Suspense } from 'react'

// Lazy load advanced tracking
const AdvancedTracking = lazy(() => 
  import('./components/AdvancedTracking')
)

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdvancedTracking />
    </Suspense>
  )
}
```

## Performance Testing

### Load Testing with Tracking

```jsx
function LoadTest() {
  useEffect(() => {
    // Simulate high load
    const intervals = []
    
    for (let i = 0; i < 100; i++) {
      intervals.push(setInterval(() => {
        trackEvent('load_test', { iteration: i })
      }, 10)) // 100 events per second
    }

    return () => intervals.forEach(clearInterval)
  }, [])

  return <div>Load testing in progress...</div>
}
```

### Memory Leak Detection

```jsx
function MemoryLeakDetector() {
  const { recordMemoryUsage, metrics } = usePerformanceOptimization()

  useEffect(() => {
    const interval = setInterval(() => {
      recordMemoryUsage()
      
      // Check for memory leaks
      if (metrics.memoryUsage.length > 10) {
        const recent = metrics.memoryUsage.slice(-10)
        const isLeaking = recent.every((val, i) => 
          i === 0 || val > recent[i-1]
        )
        
        if (isLeaking) {
          console.warn('Potential memory leak detected!')
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [recordMemoryUsage, metrics])

  return null
}
```

## Best Practices

### 1. Use Passive Event Listeners
```jsx
window.addEventListener('scroll', handler, { passive: true })
```

### 2. Batch DOM Reads/Writes
```jsx
// Good - batch operations
const elements = document.querySelectorAll('.track-element')
elements.forEach(el => {
  const rect = el.getBoundingClientRect()
  trackVisibility(el.id, rect)
})
```

### 3. Use requestIdleCallback
```jsx
const trackWhenIdle = (data) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => trackEvent(data))
  } else {
    setTimeout(() => trackEvent(data), 0)
  }
}
```

### 4. Monitor Performance Budgets
Set performance budgets and monitor them:

```jsx
const PERFORMANCE_BUDGETS = {
  renderTime: 16,      // 60fps
  memoryIncrease: 10,  // 10MB max increase
  eventFrequency: 100  // 100 events per second max
}
```

## Troubleshooting Performance Issues

### Common Issues and Solutions

1. **High Memory Usage**
   - Enable LRU caching
   - Implement proper cleanup in useEffect
   - Use weak references for large objects

2. **Slow Render Times**
   - Use React.memo for expensive components
   - Implement virtualization for long lists
   - Debounce high-frequency updates

3. **Network Congestion**
   - Increase batch sizes
   - Enable compression
   - Implement retry logic with exponential backoff

4. **Battery Drain on Mobile**
   - Enable adaptive tracking
   - Reduce event frequency
   - Use passive event listeners