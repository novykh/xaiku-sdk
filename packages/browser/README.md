# @xaiku/browser

Vanilla JavaScript SDK for A/B testing and variant display with automatic tracking.

## Installation

```bash
npm install @xaiku/browser
# or
pnpm add @xaiku/browser
```

## Quick Start

```javascript
import xaikuBrowser from '@xaiku/browser'

// Initialize SDK
const sdk = xaikuBrowser({
  apiUrl: 'https://api.xaiku.com',
  pkey: 'your-public-key'
})

// Get variant text with fallback
const headline = sdk.getVariantText('homepage-test', 'headline', {
  fallback: 'Welcome to our site!'
})

// Update DOM element
document.getElementById('headline').textContent = headline

// Track view (automatic with getVariantText)
sdk.track.events.trackView({
  projectId: 'homepage-test',
  partId: 'headline'
})
```

## Core Features

### Variant Text Display
Get text variants with automatic fallback handling:

```javascript
// Basic usage
const buttonText = sdk.getVariantText('cta-test', 'button', {
  fallback: 'Sign Up'
})

// With control group
const headline = sdk.getVariantText('hero-test', 'headline', {
  fallback: 'Default Headline',
  control: false // or true to force control
})

// Update DOM
document.querySelector('#hero h1').textContent = headline
document.querySelector('#cta-button').textContent = buttonText
```

### Event Tracking
Simple tracking for marketing metrics:

```javascript
// Track views (impressions)
sdk.track.events.trackView({
  projectId: 'homepage-test',
  variantId: 'variant-a', // optional, auto-detected
  partId: 'hero-section'
})

// Track clicks
sdk.track.events.trackClick({
  projectId: 'cta-test',
  partId: 'signup-button'
})

// Track conversions with value
sdk.track.events.trackConversion({
  projectId: 'checkout-flow',
  partId: 'purchase',
  value: 99.99
})
```

## Complete Example

### Landing Page A/B Test

```html
<!DOCTYPE html>
<html>
<head>
  <title>Landing Page Test</title>
</head>
<body>
  <header>
    <h1 id="headline">Loading...</h1>
    <p id="subtitle">Loading...</p>
    <button id="cta-button">Loading...</button>
  </header>

  <script type="module">
    import xaikuBrowser from '@xaiku/browser'

    // Initialize SDK
    const sdk = xaikuBrowser({
      pkey: 'your-public-key'
    })

    // Get variant text and update DOM
    const headline = sdk.getVariantText('landing', 'headline', {
      fallback: 'Transform Your Business'
    })
    const subtitle = sdk.getVariantText('landing', 'subtitle', {
      fallback: 'Join thousands of satisfied customers'
    })
    const ctaText = sdk.getVariantText('landing', 'cta', {
      fallback: 'Start Free Trial'
    })

    // Update DOM elements
    document.getElementById('headline').textContent = headline
    document.getElementById('subtitle').textContent = subtitle
    document.getElementById('cta-button').textContent = ctaText

    // Track views (automatic with getVariantText)
    sdk.track.events.trackView({
      projectId: 'landing',
      partId: 'headline'
    })
    sdk.track.events.trackView({
      projectId: 'landing', 
      partId: 'subtitle'
    })

    // Track CTA clicks
    document.getElementById('cta-button').addEventListener('click', () => {
      // Track click
      sdk.track.events.trackClick({
        projectId: 'landing',
        partId: 'cta'
      })

      // Handle conversion
      handleSignup()
    })

    async function handleSignup() {
      try {
        const response = await fetch('/api/signup', { method: 'POST' })
        if (response.ok) {
          // Track successful conversion
          sdk.track.events.trackConversion({
            projectId: 'landing',
            partId: 'signup',
            value: 29.99
          })
        }
      } catch (error) {
        console.error('Signup failed:', error)
      }
    }
  </script>
</body>
</html>
```

### E-commerce Product Page

```javascript
import xaikuBrowser from '@xaiku/browser'

// Initialize for e-commerce
const sdk = xaikuBrowser({
  pkey: 'ecommerce-key'
})

// Update product page content
function updateProductPage(productId) {
  // Get variant content
  const productTitle = sdk.getVariantText('product', 'title', {
    fallback: 'Amazing Product'
  })
  const addToCartText = sdk.getVariantText('product', 'add-to-cart', {
    fallback: 'Add to Cart'
  })
  const buyNowText = sdk.getVariantText('product', 'buy-now', {
    fallback: 'Buy Now'
  })

  // Update DOM
  document.querySelector('.product-title').textContent = productTitle
  document.querySelector('.add-to-cart-btn').textContent = addToCartText
  document.querySelector('.buy-now-btn').textContent = buyNowText

  // Track product view
  sdk.track.events.trackView({
    projectId: 'product',
    partId: 'product-page',
    productId
  })

  // Track add to cart
  document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
    sdk.track.events.trackClick({
      projectId: 'product',
      partId: 'add-to-cart',
      productId
    })
    // Add to cart logic...
  })

  // Track purchase conversion
  document.querySelector('.buy-now-btn').addEventListener('click', () => {
    sdk.track.events.trackConversion({
      projectId: 'product',
      partId: 'purchase',
      productId,
      value: getProductPrice(productId)
    })
    // Purchase logic...
  })
}
```

### Multi-page Application

```javascript
import xaikuBrowser from '@xaiku/browser'

const sdk = xaikuBrowser({
  pkey: 'your-public-key'
})

// Update page content based on route
function updatePageContent(route) {
  switch (route) {
    case '/':
      updateHomePage()
      break
    case '/products':
      updateProductsPage()
      break
    case '/about':
      updateAboutPage()
      break
  }
}

function updateHomePage() {
  // Hero section variants
  const heroHeadline = sdk.getVariantText('homepage', 'hero-headline', {
    fallback: 'Welcome to Our Platform'
  })
  const heroSubtext = sdk.getVariantText('homepage', 'hero-subtext', {
    fallback: 'The best solution for your needs'
  })

  document.querySelector('#hero h1').textContent = heroHeadline
  document.querySelector('#hero p').textContent = heroSubtext

  // Track page view
  sdk.track.events.trackView({
    projectId: 'homepage',
    partId: 'hero'
  })
}

function updateProductsPage() {
  // Product listing variants
  const listingTitle = sdk.getVariantText('products', 'listing-title', {
    fallback: 'Our Products'
  })
  const filterText = sdk.getVariantText('products', 'filter-label', {
    fallback: 'Filter by category'
  })

  document.querySelector('#products h1').textContent = listingTitle
  document.querySelector('.filter-label').textContent = filterText

  // Track page view
  sdk.track.events.trackView({
    projectId: 'products',
    partId: 'listing'
  })
}

// Handle navigation
window.addEventListener('popstate', () => {
  updatePageContent(window.location.pathname)
})

// Initial page load
updatePageContent(window.location.pathname)
```

## API Reference

### SDK Initialization
```javascript
const sdk = xaikuBrowser(options)
```

**Options:**
- `pkey` (string) - Your public API key
- `apiUrl` (string) - API endpoint URL (optional)
- `projectIds` (array) - Pre-load specific projects (optional)

### Variant Text
```javascript
sdk.getVariantText(projectId, partId, options)
```

**Parameters:**
- `projectId` (string) - A/B test project ID
- `partId` (string) - Specific part/component ID
- `options.fallback` (string) - Default text if variant fails
- `options.control` (boolean) - Force control group (optional)

### Event Tracking
```javascript
// Track impressions
sdk.track.events.trackView(data)

// Track interactions  
sdk.track.events.trackClick(data)

// Track conversions
sdk.track.events.trackConversion(data)
```

**Data object:**
- `projectId` (string) - A/B test project ID
- `partId` (string) - Component ID (optional)
- `variantId` (string) - Variant ID (auto-detected if not provided)
- `value` (number) - Conversion value (trackConversion only)

### Utility Methods
```javascript
// Get current variant for project
const variant = sdk.getVariant('project-id')

// Get specific variant ID
const variantId = sdk.getVariantId('project-id')

// Check if user is in control group
const isControl = sdk.isControl('project-id')

// Manually flush tracking events
sdk.track.flush()

// Clean up SDK resources
sdk.destroy()
```

## Features

- **Automatic tracking** - Views tracked when getting variant text
- **Fallback handling** - Graceful degradation when variants fail
- **Lightweight** - Minimal bundle size and performance impact
- **Framework agnostic** - Works with any JavaScript application
- **Automatic batching** - Events are batched and sent efficiently

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build package
pnpm build

# Lint code
pnpm lint
```