# Core Tracking Features

The Xaiku React SDK provides comprehensive tracking capabilities for A/B tests and user analytics.

## Basic Tracking

### Automatic Impression Tracking

All `<Text>` components automatically track impressions when rendered:

```jsx
// This automatically tracks an impression
<Text projectId="homepage-test" id="headline" fallback="Welcome!" />
```

**Features:**
- ✅ Deduplication prevents multiple impressions on re-renders
- ✅ Only tracks once per unique variant combination
- ✅ Handles React strict mode and component remounting
- ✅ Tracks actual variant ID served to user

### Manual Impression Tracking

Use `useTrackView` for custom impression tracking:

```jsx
import { useTrackView } from '@xaiku/react'

function CustomComponent() {
  // Track impression when component mounts
  useTrackView({ 
    projectId: "test-123", 
    partId: "custom-section",
    variantId: "variant-a" // optional, auto-detected if not provided
  })
  
  return <div>Custom content</div>
}
```

### Click Tracking

Track user interactions with variants:

```jsx
import { useTrackClick } from '@xaiku/react'

function CTAButton() {
  const trackClick = useTrackClick({ 
    projectId: "cta-test", 
    partId: "primary-button" 
  })
  
  return (
    <button onClick={trackClick}>
      Sign Up Now
    </button>
  )
}
```

## Tracking Data Structure

All tracking events include:

```javascript
{
  projectId: "test-123",           // A/B test project
  variantId: "variant-a",          // Specific variant shown
  partId: "headline",              // Component/element identifier
  timestamp: 1640995200000,        // Event timestamp
  sessionId: "user-session-123",   // User session
  userId: "user-456"               // User identifier (if available)
}
```

## Event Types

### 1. Impression Events (`trackView`)
- Fired when variant is displayed to user
- Includes visibility context and timing
- Deduplicated automatically

### 2. Interaction Events (`trackClick`)
- User clicks, taps, or interactions
- Includes interaction type and target
- Can track multiple interactions per variant

### 3. Custom Events (`trackNumericMetric`)
- Business-specific metrics
- Custom conversion events
- Performance measurements

## Deduplication Logic

The SDK prevents duplicate tracking using composite keys:

```
Tracking Key Format: "{projectId}:{variantId}:{partId}"
Example: "homepage-test:variant-b:headline"
```

**Deduplication Rules:**
- Same tracking key = No duplicate impression
- Different variant for same project/part = New impression
- Component remount with same variant = No duplicate
- Page refresh = New impression (new session)

## Best Practices

### 1. Consistent Part IDs
Use descriptive, consistent part IDs across variants:

```jsx
// Good
<Text projectId="checkout" id="submit-button" />
<Text projectId="checkout" id="payment-form" />

// Avoid
<Text projectId="checkout" id="btn1" />
<Text projectId="checkout" id="form" />
```

### 2. Project Organization
Group related variants under projects:

```jsx
<Project id="homepage-redesign">
  <Text id="hero-headline" fallback="Welcome" />
  <Text id="hero-subtext" fallback="Get started today" />
  <Text id="cta-button" fallback="Sign Up" />
</Project>
```

### 3. Fallback Content
Always provide meaningful fallbacks:

```jsx
// Good - descriptive fallback
<Text id="pricing" fallback="Starting at $9/month" />

// Avoid - generic fallback
<Text id="pricing" fallback="Loading..." />
```

## Debugging Tracking

### Enable Debug Mode

```jsx
<XaikuProvider debug={true} /* other props */>
  {/* Your app */}
</XaikuProvider>
```

### Console Logging
When debug is enabled, you'll see:

```
[Xaiku] Impression tracked: homepage-test:variant-a:headline
[Xaiku] Click tracked: cta-test:variant-b:submit-button
[Xaiku] Duplicate prevented: homepage-test:variant-a:headline
```

### Tracking Verification

Check tracking in browser DevTools:

```javascript
// Access SDK instance
window.xaikuSDK?.storage?.get('tracked_impressions')

// View tracking history
window.xaikuSDK?.getTrackingHistory?.()
```

## Common Issues

### 1. No Impressions Tracked
- Check `projectId` is provided
- Verify SDK is initialized
- Check console for errors

### 2. Duplicate Impressions
- Ensure using latest SDK version
- Check for multiple SDK instances
- Verify React strict mode compatibility

### 3. Missing Click Events
- Verify click handler is called
- Check event bubbling/stopPropagation
- Ensure SDK context is available

## Performance Impact

The tracking system is optimized for production:

- **Lightweight**: < 2KB added to bundle
- **Non-blocking**: Uses `requestIdleCallback` when available
- **Batched**: Groups events for efficient transmission
- **Cached**: Prevents duplicate processing

## Example Implementation

```jsx
import React from 'react'
import { 
  XaikuProvider, 
  Project,
  Text, 
  useTrackClick 
} from '@xaiku/react'

function ProductPage() {
  const trackAddToCart = useTrackClick({ 
    projectId: "product-cta", 
    partId: "add-to-cart" 
  })

  return (
    <XaikuProvider apiUrl="https://api.xaiku.com" pkey="pk_123">
      <Project id="product-redesign">
        <Text id="product-title" fallback="Amazing Product">
          {(title) => <h1>{title}</h1>}
        </Text>
        
        <Text id="product-description" fallback="The best product ever">
          {(description) => <p>{description}</p>}
        </Text>
        
        <Text id="cta-button" fallback="Add to Cart">
          {(buttonText) => (
            <button onClick={trackAddToCart}>
              {buttonText}
            </button>
          )}
        </Text>
      </Project>
    </XaikuProvider>
  )
}
```