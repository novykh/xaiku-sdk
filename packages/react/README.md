# @xaiku/react

React components and hooks for A/B testing and variant display with the Xaiku SDK.

## Installation

```bash
npm install @xaiku/react
# or
pnpm add @xaiku/react
```

## Quick Start

```jsx
import React from 'react'
import { XaikuProvider, Text } from '@xaiku/react'

function App() {
  return (
    <XaikuProvider apiUrl="https://api.xaiku.com" pkey="your-public-key">
      <Text projectId="homepage-hero" id="headline" fallback="Welcome!">
        {(text) => <h1>{text}</h1>}
      </Text>
    </XaikuProvider>
  )
}
```

## Core Components

### XaikuProvider
Provides SDK context to child components.

```jsx
<XaikuProvider 
  apiUrl="https://api.xaiku.com"
  pkey="your-public-key"
  projectIds={["project-1", "project-2"]}
>
  {/* Your app */}
</XaikuProvider>
```

### Text Component
Displays A/B test variants with automatic view tracking and fallback handling.

```jsx
// Basic usage
<Text projectId="test-123" id="button-text" fallback="Click Here" />

// With render prop
<Text projectId="test-123" id="headline" fallback="Default Headline">
  {(text) => <h1 className="hero-title">{text}</h1>}
</Text>

// With custom element
<Text projectId="test-123" id="cta" fallback="Sign Up">
  <button className="btn-primary" />
</Text>
```

### Project Context
Group related variants under a project context.

```jsx
import { Project } from '@xaiku/react'

<Project id="homepage-test">
  <Text id="headline" fallback="Welcome" />
  <Text id="subtitle" fallback="Get started today" />
</Project>
```

## Tracking Hooks

### useTrackView
Track when variants are viewed (automatic with Text component).

```jsx
import { useTrackView } from '@xaiku/react'

function MyComponent() {
  useTrackView({ projectId: "test-123", partId: "custom-section" })
  return <div>Custom content</div>
}
```

### useTrackClick
Track user interactions.

```jsx
import { useTrackClick } from '@xaiku/react'

function Button() {
  const trackClick = useTrackClick({ projectId: "test-123", partId: "cta" })
  
  return <button onClick={trackClick}>Click me</button>
}
```

### useTrackConversion
Track conversions with optional value.

```jsx
import { useTrackConversion } from '@xaiku/react'

function CheckoutButton() {
  const trackConversion = useTrackConversion({ 
    projectId: "test-123", 
    partId: "checkout",
    value: 99.99 
  })
  
  const handlePurchase = () => {
    // Process purchase...
    trackConversion() // Track the conversion
  }
  
  return <button onClick={handlePurchase}>Complete Purchase</button>
}
```

## Complete Example

```jsx
import React from 'react'
import { XaikuProvider, Project, Text, useTrackClick, useTrackConversion } from '@xaiku/react'

function HomePage() {
  const trackCTAClick = useTrackClick({ projectId: "homepage", partId: "hero-cta" })
  const trackSignup = useTrackConversion({ projectId: "homepage", partId: "signup" })

  const handleSignup = () => {
    // Handle signup logic...
    trackSignup() // Track conversion
  }

  return (
    <XaikuProvider pkey="your-public-key">
      <Project id="homepage">
        {/* Automatic view tracking */}
        <Text id="headline" fallback="Welcome to our platform">
          {(text) => <h1>{text}</h1>}
        </Text>
        
        <Text id="subtitle" fallback="Get started today">
          {(text) => <p>{text}</p>}
        </Text>
        
        {/* Manual click tracking */}
        <Text id="cta-text" fallback="Sign Up">
          {(text) => (
            <button 
              onClick={() => {
                trackCTAClick()
                handleSignup()
              }}
            >
              {text}
            </button>
          )}
        </Text>
      </Project>
    </XaikuProvider>
  )
}
```

## Features

- **Automatic view tracking** - Text components track views once per variant
- **Fallback handling** - Gracefully handles variant loading failures  
- **Deduplication** - Prevents duplicate tracking on re-renders
- **Project context** - Groups related variants together
- **Simple API** - Minimal setup for A/B testing

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

## API Reference

### Components
- `XaikuProvider` - SDK context provider
- `Text` - A/B test variant display with automatic tracking
- `Project` - Project context wrapper

### Hooks
- `useSDK()` - Access SDK instance
- `useProjectId()` - Get current project context
- `useText(projectId, id, fallback, control)` - Get variant text
- `useTrackView(options)` - Track impressions
- `useTrackClick(options)` - Track clicks
- `useTrackConversion(options)` - Track conversions

## TypeScript Support

Type definitions are included:

```typescript
import type { XaikuProviderProps, TextProps } from '@xaiku/react'
```