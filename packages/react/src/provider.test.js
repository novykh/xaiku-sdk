import React from 'react'
import { render, screen } from '@testing-library/react'
import Provider, { useSdk, XaikuContext } from './provider'
import makeSdk from '@xaiku/browser'

// Mock the makeSdk function
jest.mock('@xaiku/browser', () => jest.fn(() => ({ sdk: 'mockedSDK' })))

const TestComponent = () => {
  const sdk = useSdk()
  return <div>{sdk ? 'SDK Loaded' : 'SDK Not Loaded'}</div>
}

describe('Provider', () => {
  it('provides the SDK to its children', () => {
    render(
      <Provider pkey="test-pkey">
        <TestComponent />
      </Provider>
    )
    expect(screen.getByText('SDK Loaded')).toBeInTheDocument()
  })

  it('uses the provided SDK if available', () => {
    const customSDK = { sdk: 'customSDK' }
    render(
      <Provider sdk={customSDK} pkey="test-pkey">
        <TestComponent />
      </Provider>
    )
    expect(screen.getByText('SDK Loaded')).toBeInTheDocument()
  })

  it('creates a new SDK if not provided', () => {
    render(
      <Provider pkey="test-pkey">
        <TestComponent />
      </Provider>
    )
    expect(makeSdk).toHaveBeenCalledWith({
      pkey: 'test-pkey',
      framework: 'react',
      frameworkVersion: React.version,
    })
  })
})

describe('XaikuContext', () => {
  it('should have a default value of null', () => {
    expect(XaikuContext._currentValue).toBe(null)
  })
})
