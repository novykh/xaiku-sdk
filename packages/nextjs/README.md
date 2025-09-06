# @xaiku/nextjs

Next.js integration for A/B testing and variant display with the Xaiku SDK.

## Installation

```bash
npm install @xaiku/nextjs
# or
pnpm add @xaiku/nextjs
```

## Quick Start

### Client Components

```jsx
// app/page.js
'use client'
import { XaikuProvider, Text } from '@xaiku/nextjs'

export default function HomePage() {
  return (
    <XaikuProvider pkey="your-public-key">
      <Text projectId="homepage-hero" id="headline" fallback="Welcome to our site!">
        {(text) => <h1>{text}</h1>}
      </Text>
    </XaikuProvider>
  )
}
```

### Server Components (App Router)

```jsx
// app/layout.js
import { XaikuProvider } from '@xaiku/nextjs'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <XaikuProvider pkey="your-public-key">
          {children}
        </XaikuProvider>
      </body>
    </html>
  )
}
```

```jsx
// app/page.js
import { Text } from '@xaiku/nextjs'

export default function HomePage() {
  return (
    <div>
      <Text projectId="homepage" id="hero-title" fallback="Welcome">
        {(text) => <h1>{text}</h1>}
      </Text>
      
      <Text projectId="homepage" id="hero-subtitle" fallback="Get started today">
        {(text) => <p className="text-lg">{text}</p>}
      </Text>
    </div>
  )
}
```

## Complete Example with Tracking

```jsx
// app/components/landing-page.js
'use client'
import { Text, useTrackClick, useTrackConversion } from '@xaiku/nextjs'

export default function LandingPage() {
  const trackCTAClick = useTrackClick({ projectId: "landing", partId: "hero-cta" })
  const trackSignup = useTrackConversion({ projectId: "landing", partId: "signup", value: 29.99 })

  const handleSignup = async () => {
    try {
      // Handle signup logic
      const response = await fetch('/api/signup', { method: 'POST' })
      if (response.ok) {
        trackSignup() // Track successful conversion
      }
    } catch (error) {
      console.error('Signup failed:', error)
    }
  }

  return (
    <div className="hero-section">
      {/* Automatic view tracking */}
      <Text projectId="landing" id="headline" fallback="Transform Your Business">
        {(text) => <h1 className="text-4xl font-bold">{text}</h1>}
      </Text>
      
      <Text projectId="landing" id="description" fallback="Join thousands of satisfied customers">
        {(text) => <p className="text-xl text-gray-600">{text}</p>}
      </Text>
      
      {/* Manual click and conversion tracking */}
      <Text projectId="landing" id="cta-button" fallback="Start Free Trial">
        {(text) => (
          <button 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg"
            onClick={() => {
              trackCTAClick() // Track the click
              handleSignup()   // Handle conversion
            }}
          >
            {text}
          </button>
        )}
      </Text>
    </div>
  )
}
```

## Pages Router (Legacy)

```jsx
// pages/_app.js
import { XaikuProvider } from '@xaiku/nextjs'

export default function App({ Component, pageProps }) {
  return (
    <XaikuProvider pkey="your-public-key">
      <Component {...pageProps} />
    </XaikuProvider>
  )
}
```

```jsx
// pages/index.js
import { Text, useTrackClick } from '@xaiku/nextjs'

export default function HomePage() {
  const trackClick = useTrackClick({ projectId: "home", partId: "hero" })
  
  return (
    <div>
      <Text projectId="home" id="title" fallback="Welcome">
        {(text) => <h1>{text}</h1>}
      </Text>
      
      <button onClick={trackClick}>
        Get Started
      </button>
    </div>
  )
}
```

## E-commerce Example

```jsx
// app/components/product-card.js
'use client'
import { Text, useTrackClick, useTrackConversion } from '@xaiku/nextjs'

export default function ProductCard({ productId, price }) {
  const trackAddToCart = useTrackClick({ 
    projectId: "ecommerce", 
    partId: `product-${productId}`,
    variantId: "add-to-cart-button"
  })
  
  const trackPurchase = useTrackConversion({ 
    projectId: "ecommerce", 
    partId: `product-${productId}`,
    value: price 
  })

  const handleAddToCart = () => {
    trackAddToCart()
    // Add to cart logic...
  }

  const handleBuyNow = () => {
    trackPurchase()
    // Purchase logic...
  }

  return (
    <div className="product-card">
      <Text projectId="ecommerce" id={`product-title-${productId}`} fallback="Amazing Product">
        {(text) => <h3>{text}</h3>}
      </Text>
      
      <Text projectId="ecommerce" id={`add-to-cart-${productId}`} fallback="Add to Cart">
        {(text) => (
          <button onClick={handleAddToCart} className="btn-secondary">
            {text}
          </button>
        )}
      </Text>
      
      <Text projectId="ecommerce" id={`buy-now-${productId}`} fallback="Buy Now">
        {(text) => (
          <button onClick={handleBuyNow} className="btn-primary">
            {text}
          </button>
        )}
      </Text>
    </div>
  )
}
```

## API

The Next.js package re-exports all React components and hooks with Next.js-specific optimizations:

### Components
- `XaikuProvider` - SDK context provider
- `Text` - A/B test variant display with automatic tracking

### Hooks  
- `useTrackView(options)` - Track impressions
- `useTrackClick(options)` - Track clicks
- `useTrackConversion(options)` - Track conversions
- `useText(projectId, id, fallback, control)` - Get variant text

## Features

- **App Router support** - Works with Next.js 13+ App Router
- **Server Components** - Compatible with React Server Components
- **Pages Router** - Backward compatible with Pages Router
- **Automatic framework detection** - Identifies as Next.js in analytics
- **All React features** - Inherits all @xaiku/react functionality

## TypeScript Support

```typescript
import type { XaikuProviderProps, TextProps } from '@xaiku/nextjs'
```

## Development

```bash
# Install dependencies
pnpm install

# Build package
pnpm build

# Lint code
pnpm lint
```