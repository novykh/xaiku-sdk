# Error Handling & Boundaries

Robust error handling for A/B test variants with automatic fallbacks and error tracking.

## Overview

The Xaiku SDK provides comprehensive error handling to ensure variants don't break your application. When variant content fails, the system gracefully falls back to safe defaults while tracking errors for analysis.

## Error Boundary Components

### XaikuErrorBoundary
Catches JavaScript errors in variant components and provides fallback UI:

```jsx
import { XaikuErrorBoundary } from '@xaiku/react'

function App() {
  return (
    <XaikuErrorBoundary
      projectId="hero-test"
      variantId="variant-a"
      partId="hero-section"
      fallback={<div>Something went wrong. Please try again.</div>}
      errorMessage="Hero section unavailable"
      onError={(error, errorInfo, context) => {
        console.log('Variant error:', error.message)
        console.log('Context:', context)
      }}
    >
      <HeroSection />
    </XaikuErrorBoundary>
  )
}
```

**Props:**
- `projectId` - A/B test project identifier
- `variantId` - Specific variant (optional, auto-detected)
- `partId` - Component part identifier
- `fallback` - Custom fallback JSX element
- `errorMessage` - Default error message string
- `onError` - Error callback function

### SafeText Component
Error-safe version of the Text component with automatic fallbacks:

```jsx
import { SafeText } from '@xaiku/react'

function ProductCard() {
  return (
    <div className="product-card">
      <SafeText
        projectId="product-names"
        id="product-title"
        fallback="Product Name"
        errorFallback={<h3>Product</h3>}
        errorMessage="Title unavailable"
      />
      
      <SafeText
        projectId="product-descriptions"
        id="product-desc"
        fallback="Product description"
        errorFallback={<p>Description coming soon</p>}
      />
    </div>
  )
}
```

**Additional Props:**
- `errorFallback` - JSX element to show on error
- All standard Text component props

## Error Tracking Hooks

### useXaikuErrorBoundary
Hook for programmatic error handling with variant context:

```jsx
import { useXaikuErrorBoundary } from '@xaiku/react'

function CustomComponent() {
  const handleError = useXaikuErrorBoundary({
    projectId: "custom-widget",
    partId: "data-visualization"
  })

  useEffect(() => {
    try {
      // Risky operation that might fail
      processVariantData()
    } catch (error) {
      handleError(error, { 
        context: 'data processing',
        timestamp: Date.now() 
      })
    }
  }, [handleError])

  return <div>Custom widget content</div>
}
```

### useTrackPerformanceImpact (Error Tracking)
Tracks variant-related errors with performance context:

```jsx
import { useTrackPerformanceImpact } from '@xaiku/react'

function MonitoredComponent() {
  const { trackError } = useTrackPerformanceImpact({
    projectId: "performance-test",
    partId: "heavy-component"
  })

  const handleAsyncError = async () => {
    try {
      await fetchVariantData()
    } catch (error) {
      trackError(error) // Automatically includes performance context
    }
  }

  return <button onClick={handleAsyncError}>Load Data</button>
}
```

## Error Types and Handling

### 1. Rendering Errors
Errors during component rendering:

```jsx
function ProblematicVariant() {
  // This might throw an error
  const data = JSON.parse(invalidJson)
  
  return <div>{data.message}</div>
}

// Wrap with error boundary
<XaikuErrorBoundary 
  projectId="json-test" 
  fallback={<div>Data unavailable</div>}
>
  <ProblematicVariant />
</XaikuErrorBoundary>
```

### 2. Network Errors
API failures when fetching variant data:

```jsx
function NetworkErrorHandler() {
  const [error, setError] = useState(null)
  const handleError = useXaikuErrorBoundary({
    projectId: "api-test",
    partId: "data-fetch"
  })

  useEffect(() => {
    fetchVariantData()
      .catch(err => {
        setError(err)
        handleError(err, { type: 'network', url: err.url })
      })
  }, [handleError])

  if (error) {
    return <div>Unable to load content. Using default.</div>
  }

  return <div>Content loaded successfully</div>
}
```

### 3. Variant Configuration Errors
Invalid or missing variant configurations:

```jsx
function ConfigErrorExample() {
  return (
    <SafeText
      projectId="nonexistent-project"
      id="invalid-variant"
      fallback="Safe fallback content"
      errorFallback={<span>Configuration error - using default</span>}
    />
  )
}
```

## Error Recovery Strategies

### Automatic Retry
Implement retry logic for transient errors:

```jsx
function RetryableComponent() {
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  const handleError = useXaikuErrorBoundary({
    projectId: "retry-test",
    partId: "retryable-content"
  })

  const retryOperation = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1)
      // Retry the failed operation
    } else {
      handleError(new Error('Max retries exceeded'), {
        retryCount,
        maxRetries
      })
    }
  }, [retryCount, maxRetries, handleError])

  return (
    <div>
      <button onClick={retryOperation}>
        Retry ({retryCount}/{maxRetries})
      </button>
    </div>
  )
}
```

### Progressive Fallbacks
Multiple levels of fallback content:

```jsx
function ProgressiveFallback() {
  const [fallbackLevel, setFallbackLevel] = useState(0)

  const fallbacks = [
    () => <RichVariantContent />,      // Level 0: Full variant
    () => <BasicVariantContent />,     // Level 1: Simplified version
    () => <StaticContent />,           // Level 2: Static fallback
    () => <div>Content unavailable</div> // Level 3: Minimal fallback
  ]

  const CurrentContent = fallbacks[fallbackLevel] || fallbacks[3]

  return (
    <XaikuErrorBoundary
      projectId="progressive-test"
      onError={() => {
        if (fallbackLevel < fallbacks.length - 1) {
          setFallbackLevel(prev => prev + 1)
        }
      }}
    >
      <CurrentContent />
    </XaikuErrorBoundary>
  )
}
```

## Error Analytics and Monitoring

### Error Rate Tracking
Monitor error rates by variant:

```jsx
function ErrorRateMonitor() {
  const [errorCount, setErrorCount] = useState(0)
  const [totalRenders, setTotalRenders] = useState(0)

  useEffect(() => {
    setTotalRenders(prev => prev + 1)
  })

  const handleError = useXaikuErrorBoundary({
    projectId: "error-monitoring",
    partId: "error-prone-component"
  })

  const trackError = (error) => {
    setErrorCount(prev => prev + 1)
    const errorRate = (errorCount + 1) / totalRenders

    handleError(error, {
      errorRate,
      errorCount: errorCount + 1,
      totalRenders,
      timestamp: Date.now()
    })
  }

  return (
    <div>
      <p>Error Rate: {((errorCount / totalRenders) * 100).toFixed(2)}%</p>
      <p>Errors: {errorCount} / {totalRenders}</p>
    </div>
  )
}
```

### Error Context Enrichment
Add contextual information to error reports:

```jsx
function EnrichedErrorReporting() {
  const handleError = useXaikuErrorBoundary({
    projectId: "context-test",
    partId: "enriched-component"
  })

  const enrichedErrorHandler = (error) => {
    const context = {
      // User context
      userId: getCurrentUserId(),
      sessionId: getSessionId(),
      
      // Environment context
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      url: window.location.href,
      
      // App context
      timestamp: Date.now(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      
      // Performance context
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize
      } : null
    }

    handleError(error, context)
  }

  return (
    <XaikuErrorBoundary 
      projectId="enriched-test"
      onError={enrichedErrorHandler}
    >
      <ComplexVariantComponent />
    </XaikuErrorBoundary>
  )
}
```

## Error Boundary Best Practices

### 1. Granular Error Boundaries
Place error boundaries at component level for isolation:

```jsx
// Good - isolates each variant component
function ProductPage() {
  return (
    <div>
      <XaikuErrorBoundary projectId="product-header">
        <ProductHeader />
      </XaikuErrorBoundary>
      
      <XaikuErrorBoundary projectId="product-details">
        <ProductDetails />
      </XaikuErrorBoundary>
      
      <XaikuErrorBoundary projectId="product-reviews">
        <ProductReviews />
      </XaikuErrorBoundary>
    </div>
  )
}

// Avoid - one boundary affects entire page
function ProductPage() {
  return (
    <XaikuErrorBoundary projectId="product-page">
      <div>
        <ProductHeader />
        <ProductDetails />
        <ProductReviews />
      </div>
    </XaikuErrorBoundary>
  )
}
```

### 2. Meaningful Fallbacks
Provide fallbacks that maintain user flow:

```jsx
// Good - maintains shopping experience
<SafeText
  id="add-to-cart-button"
  fallback="Add to Cart"
  errorFallback={<button>Add to Cart</button>}
/>

// Avoid - breaks user experience
<SafeText
  id="add-to-cart-button"
  fallback="Add to Cart"
  errorFallback={<div>Error occurred</div>}
/>
```

### 3. Error Logging Integration
Integrate with error tracking services:

```jsx
function ErrorTrackingSetup() {
  const handleError = useXaikuErrorBoundary({
    projectId: "error-tracking",
    partId: "monitored-component"
  })

  const customErrorHandler = (error, errorInfo, context) => {
    // Track in Xaiku
    handleError(error, { ...context, errorInfo })
    
    // Also track in external services
    if (typeof window !== 'undefined') {
      // Sentry
      window.Sentry?.captureException(error, {
        tags: { variant: context.variantId },
        extra: context
      })
      
      // LogRocket
      window.LogRocket?.captureException(error)
      
      // Custom analytics
      window.analytics?.track('Variant Error', {
        projectId: context.projectId,
        variantId: context.variantId,
        error: error.message
      })
    }
  }

  return (
    <XaikuErrorBoundary onError={customErrorHandler}>
      <VariantComponent />
    </XaikuErrorBoundary>
  )
}
```

## Testing Error Scenarios

### Error Simulation for Testing
Create components to test error handling:

```jsx
function ErrorSimulator({ shouldError = false, errorType = 'render' }) {
  useEffect(() => {
    if (shouldError && errorType === 'effect') {
      throw new Error('Simulated useEffect error')
    }
  }, [shouldError, errorType])

  if (shouldError && errorType === 'render') {
    throw new Error('Simulated render error')
  }

  return <div>Normal content</div>
}

// Test error boundary
function ErrorBoundaryTest() {
  const [simulateError, setSimulateError] = useState(false)

  return (
    <div>
      <button onClick={() => setSimulateError(!simulateError)}>
        Toggle Error Simulation
      </button>
      
      <XaikuErrorBoundary 
        projectId="error-test"
        fallback={<div>Error handled gracefully</div>}
      >
        <ErrorSimulator shouldError={simulateError} />
      </XaikuErrorBoundary>
    </div>
  )
}
```

## Production Error Monitoring

Set up comprehensive error monitoring for production:

```jsx
// Error monitoring dashboard
function ErrorMonitoringDashboard() {
  const [errorStats, setErrorStats] = useState({
    totalErrors: 0,
    errorsByVariant: {},
    errorsByProject: {},
    recentErrors: []
  })

  const trackError = useCallback((error, context) => {
    setErrorStats(prev => ({
      totalErrors: prev.totalErrors + 1,
      errorsByVariant: {
        ...prev.errorsByVariant,
        [context.variantId]: (prev.errorsByVariant[context.variantId] || 0) + 1
      },
      errorsByProject: {
        ...prev.errorsByProject,
        [context.projectId]: (prev.errorsByProject[context.projectId] || 0) + 1
      },
      recentErrors: [
        { error: error.message, context, timestamp: Date.now() },
        ...prev.recentErrors.slice(0, 9) // Keep last 10 errors
      ]
    }))
  }, [])

  return (
    <div className="error-dashboard">
      <h3>Error Statistics</h3>
      <p>Total Errors: {errorStats.totalErrors}</p>
      
      <h4>Errors by Project</h4>
      <ul>
        {Object.entries(errorStats.errorsByProject).map(([project, count]) => (
          <li key={project}>{project}: {count} errors</li>
        ))}
      </ul>

      <h4>Recent Errors</h4>
      <ul>
        {errorStats.recentErrors.map((err, index) => (
          <li key={index}>
            {err.error} - {err.context.projectId} - {new Date(err.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  )
}
```