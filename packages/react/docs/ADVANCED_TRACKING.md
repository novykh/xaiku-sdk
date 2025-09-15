# Advanced Tracking Hooks

Advanced analytics and tracking capabilities for sophisticated A/B testing and user behavior analysis.

## Visibility-Based Impressions

Track impressions only when variants are actually visible to users.

### useTrackViewportImpression

```jsx
import { useTrackViewportImpression } from '@xaiku/react'

function HeroBanner() {
  const elementRef = useTrackViewportImpression({
    projectId: "hero-test",
    partId: "banner",
    threshold: 0.7,      // 70% visible
    minTime: 2000        // Visible for 2 seconds
  })

  return (
    <div ref={elementRef} className="hero-banner">
      <Text id="headline" fallback="Welcome!" />
    </div>
  )
}
```

**Configuration Options:**
- `threshold` (0-1): Percentage of element that must be visible
- `minTime` (ms): Minimum time element must stay visible
- Standard tracking options: `projectId`, `variantId`, `partId`

**Use Cases:**
- Above-the-fold content tracking
- Scroll-triggered impressions
- Lazy-loaded content analytics
- Ad viewability measurement

## Engagement Duration Tracking

Monitor how long users actively engage with variants.

### useTrackEngagement

```jsx
import { useTrackEngagement } from '@xaiku/react'

function ArticlePage() {
  const { isTracking, trackEngagement } = useTrackEngagement({
    projectId: "content-test",
    partId: "article-body",
    idleThreshold: 30000  // 30 seconds idle = end session
  })

  return (
    <article>
      <div className={`engagement-indicator ${isTracking ? 'active' : 'idle'}`}>
        {isTracking ? 'Reading...' : 'Idle'}
      </div>
      <Text id="article-content" fallback="Article text..." />
    </article>
  )
}
```

**Tracked Activities:**
- Mouse movement
- Keyboard input  
- Scroll events
- Click interactions
- Tab visibility changes

**Data Collected:**
- Total engagement time
- Session duration
- Activity patterns
- Idle periods

## Scroll Depth Analytics

Track how far users scroll through content with milestone tracking.

### useTrackScrollDepth

```jsx
import { useTrackScrollDepth } from '@xaiku/react'

function LongFormContent() {
  const currentScrollDepth = useTrackScrollDepth({
    projectId: "content-engagement",
    partId: "blog-post",
    milestones: [25, 50, 75, 90, 100]  // Percentage milestones
  })

  return (
    <div>
      <div className="scroll-indicator">
        Scroll Depth: {Math.round(currentScrollDepth)}%
      </div>
      <Text id="content" fallback="Long content here..." />
    </div>
  )
}
```

**Milestone Events:**
- Progressive tracking at specified percentages
- Final scroll depth on page exit
- Time spent at each milestone
- Scroll velocity analysis

## Conversion Funnel Tracking

Track user progression through conversion funnels with attribution.

### useTrackConversion

```jsx
import { useTrackConversion } from '@xaiku/react'

function CheckoutFlow() {
  const { trackFunnelStep, trackConversion } = useTrackConversion({
    projectId: "checkout-optimization",
    partId: "checkout-flow"
  })

  const handleStepComplete = (step) => {
    trackFunnelStep(step, { 
      timestamp: Date.now(),
      userAgent: navigator.userAgent 
    })
  }

  const handlePurchase = (orderData) => {
    trackConversion({ 
      revenue: orderData.total,
      items: orderData.items.length,
      paymentMethod: orderData.paymentMethod
    })
  }

  return (
    <div>
      <button onClick={() => handleStepComplete('product_viewed')}>
        View Product
      </button>
      <button onClick={() => handleStepComplete('added_to_cart')}>
        Add to Cart
      </button>
      <button onClick={() => handleStepComplete('checkout_started')}>
        Start Checkout
      </button>
      <button onClick={handlePurchase}>
        Complete Purchase
      </button>
    </div>
  )
}
```

**Funnel Analytics:**
- Step-by-step progression tracking
- Time between funnel steps
- Drop-off point identification
- Conversion attribution to variants

## Performance Impact Monitoring

Track how variants affect application performance.

### useTrackPerformanceImpact

```jsx
import { useTrackPerformanceImpact } from '@xaiku/react'

function ExpensiveComponent() {
  const { trackError } = useTrackPerformanceImpact({
    projectId: "performance-test",
    partId: "heavy-widget"
  })

  useEffect(() => {
    // Simulate error handling
    try {
      // Component logic
    } catch (error) {
      trackError(error)
    }
  }, [trackError])

  return <Text id="widget-content" fallback="Widget content" />
}
```

**Performance Metrics:**
- Component render time
- Memory usage tracking
- Error frequency
- JavaScript heap size
- Render count analysis

## A/B Test Specific Metrics

Enhanced metrics designed for statistical analysis.

### useTrackABTestMetrics

```jsx
import { useTrackABTestMetrics } from '@xaiku/react'

function ProductCard() {
  const { 
    trackMetric, 
    trackInteraction, 
    trackBusinessMetric 
  } = useTrackABTestMetrics({
    projectId: "product-card-test",
    partId: "card-layout"
  })

  const handleInteraction = (type) => {
    trackInteraction(type, { 
      timestamp: Date.now(),
      elementPosition: 'above-fold' 
    })
  }

  const handleBusinessEvent = (revenue) => {
    trackBusinessMetric('revenue_per_view', revenue, {
      currency: 'USD',
      conversion: true
    })
  }

  return (
    <div>
      <Text id="product-name" fallback="Product" />
      <button onClick={() => handleInteraction('view_details')}>
        View Details
      </button>
      <button onClick={() => handleBusinessEvent(29.99)}>
        Purchase ($29.99)
      </button>
    </div>
  )
}
```

**Business Metrics:**
- Revenue attribution
- Conversion rate calculation
- Customer lifetime value
- Session value tracking

## Real-World Implementation Examples

### E-commerce Product Page

```jsx
function ProductPage({ productId }) {
  // Visibility tracking for product images
  const imageRef = useTrackViewportImpression({
    projectId: "product-images",
    partId: `product-${productId}`,
    threshold: 0.5,
    minTime: 1000
  })

  // Engagement tracking for product description
  const { isTracking } = useTrackEngagement({
    projectId: "product-engagement",
    partId: "description"
  })

  // Conversion funnel for purchase flow
  const { trackFunnelStep, trackConversion } = useTrackConversion({
    projectId: "purchase-funnel",
    partId: `product-${productId}`
  })

  // A/B test metrics for business impact
  const { trackBusinessMetric } = useTrackABTestMetrics({
    projectId: "revenue-optimization",
    partId: "product-page"
  })

  return (
    <div>
      <div ref={imageRef}>
        <Text id="product-image" fallback="Product Image" />
      </div>
      
      <div className={`description ${isTracking ? 'engaged' : ''}`}>
        <Text id="description" fallback="Product description" />
      </div>

      <button 
        onClick={() => {
          trackFunnelStep('add_to_cart')
          trackBusinessMetric('add_to_cart_rate', 1)
        }}
      >
        Add to Cart
      </button>
    </div>
  )
}
```

### Content Marketing Page

```jsx
function BlogPost() {
  // Scroll depth for content engagement
  const scrollDepth = useTrackScrollDepth({
    projectId: "content-engagement",
    partId: "blog-post",
    milestones: [10, 25, 50, 75, 90, 100]
  })

  // Performance monitoring for content loading
  const { trackError } = useTrackPerformanceImpact({
    projectId: "content-performance",
    partId: "blog-content"
  })

  // Engagement time tracking
  const { isTracking } = useTrackEngagement({
    projectId: "reading-time",
    partId: "article-body",
    idleThreshold: 15000  // 15 seconds
  })

  return (
    <article>
      <header>
        <Text id="headline" fallback="Article Title" />
        <div className="engagement-stats">
          Reading: {isTracking ? 'Active' : 'Paused'} | 
          Progress: {Math.round(scrollDepth)}%
        </div>
      </header>
      
      <div className="content">
        <Text id="article-body" fallback="Article content..." />
      </div>
    </article>
  )
}
```

## Data Analysis Tips

### Statistical Significance
- Track minimum 1000 impressions per variant
- Run tests for at least 1-2 weeks
- Consider seasonal variations
- Monitor confidence intervals

### Metric Selection
- Choose metrics aligned with business goals
- Track both leading and lagging indicators
- Monitor secondary metrics for side effects
- Use ratio metrics for normalization

### Performance Monitoring
- Set performance budgets for variants
- Monitor error rates by variant
- Track loading time impact
- Watch memory usage trends

## Integration with Analytics Platforms

The advanced tracking data can be exported to:

- Google Analytics 4
- Mixpanel
- Amplitude
- Custom data warehouses
- Business intelligence tools

Each hook provides structured data ready for analysis in your preferred platform.