import React from 'react'
import { render, screen } from '@testing-library/react'
import { Text, useText } from './text'
import { useSDK } from './provider'
import { useProjectId } from './project'

jest.mock('./provider', () => ({
  useSDK: jest.fn(),
}))

jest.mock('./project', () => ({
  useProjectId: jest.fn(),
}))

const TestComponent = ({ projectId, id, fallback }) => {
  const text = useText(projectId, id, fallback)
  return <div>{text}</div>
}

describe('useText', () => {
  it('returns fallback when sdk is not available', () => {
    useSDK.mockReturnValue(null)
    render(<TestComponent projectId="1" id="1" fallback="Fallback Text" />)
    expect(screen.getByText('Fallback Text')).toBeInTheDocument()
  })

  it('returns fallback when getVariantText returns null', () => {
    const mockSdk = {
      getVariantText: jest.fn().mockReturnValue(null),
      on: jest.fn(),
    }
    useSDK.mockReturnValue(mockSdk)
    render(<TestComponent projectId="1" id="1" fallback="Fallback Text" />)
    expect(screen.getByText('Fallback Text')).toBeInTheDocument()
  })

  it('returns variant text when sdk is available', () => {
    const mockSdk = {
      getVariantText: jest.fn().mockReturnValue('Variant Text'),
      on: jest.fn(),
    }
    useSDK.mockReturnValue(mockSdk)
    render(<TestComponent projectId="1" id="1" fallback="Fallback Text" />)
    expect(screen.getByText('Variant Text')).toBeInTheDocument()
  })

  it('rerenders on variants:select event', () => {
    const mockSdk = {
      getVariantText: jest.fn().mockReturnValue('Variant Text'),
      on: jest.fn((event, callback) => {
        if (event === 'variants:select') {
          callback()
        }
      }),
    }
    useSDK.mockReturnValue(mockSdk)
    render(<TestComponent projectId="1" id="1" fallback="Fallback Text" />)
    expect(screen.getByText('Variant Text')).toBeInTheDocument()
  })
})

describe('Text', () => {
  it('returns fallback when no projectId is provided', () => {
    useProjectId.mockReturnValue(null)
    useSDK.mockReturnValue(null)
    render(<Text id="1" fallback="Fallback Text" />)
    expect(screen.getByText('Fallback Text')).toBeInTheDocument()
  })

  it('returns variant text when sdk is available', () => {
    const mockSdk = {
      getVariantText: jest.fn().mockReturnValue('Variant Text'),
      on: jest.fn(),
    }
    useSDK.mockReturnValue(mockSdk)
    useProjectId.mockReturnValue('1')
    render(<Text id="1" projectId="1" fallback="Fallback Text" />)
    expect(screen.getByText('Variant Text')).toBeInTheDocument()
  })

  it('returns children as fallback when needed and has no fallback prop', () => {
    const mockSdk = {
      getVariantText: jest.fn().mockReturnValue(null),
      on: jest.fn(),
    }
    useSDK.mockReturnValue(mockSdk)
    useProjectId.mockReturnValue('1')
    render(
      <Text id="1" projectId="1">
        Fallback Text
      </Text>
    )
    expect(screen.getByText('Fallback Text')).toBeInTheDocument()

    render(
      <Text id="1" projectId="1">
        {emptyString => `Fallback${emptyString}Text`}
      </Text>
    )
    expect(screen.getByText('FallbackText')).toBeInTheDocument()
  })

  it('calls children function with text', () => {
    const mockSdk = {
      getVariantText: jest.fn().mockReturnValue('Variant Text'),
      on: jest.fn(),
    }
    useSDK.mockReturnValue(mockSdk)
    useProjectId.mockReturnValue('1')
    const children = jest.fn().mockReturnValue(<div>Rendered Text</div>)
    render(
      <Text id="1" projectId="1" fallback="Fallback Text">
        {children}
      </Text>
    )
    expect(children).toHaveBeenCalledWith('Variant Text')
    expect(screen.getByText('Rendered Text')).toBeInTheDocument()
  })

  it('clones element with text as children', () => {
    const mockSdk = {
      getVariantText: jest.fn().mockReturnValue('Variant Text'),
      on: jest.fn(),
    }
    useSDK.mockReturnValue(mockSdk)
    useProjectId.mockReturnValue('1')
    render(
      <Text id="1" projectId="1" fallback="Fallback Text">
        <span>Original Text</span>
      </Text>
    )
    expect(screen.getByText('Variant Text')).toBeInTheDocument()
  })
})
