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

jest.mock('./useTrack', () => ({
  useTrackView: jest.fn(),
  useTrackClick: jest.fn(),
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
      getVariantText: jest.fn().mockReturnValue(null),
      on: (event, callback) => {
        if (event === 'variants:select') {
          callback()
          mockSdk.getVariantText.mockReturnValue('Variant Text')
        }
      },
    }
    useSDK.mockReturnValue(mockSdk)
    render(<TestComponent projectId="1" id="1" fallback="Fallback Text" />)
    expect(screen.getByText('Variant Text')).toBeInTheDocument()
  })
})

describe('Text', () => {
  it('returns fallback when no projectId is provided', () => {
    const mockSdk = {
      getVariantText: jest.fn().mockReturnValue('Variant Text'),
      on: jest.fn(),
    }
    useSDK.mockReturnValue(mockSdk)
    render(<Text id="1" fallback="Fallback Text" />)
    expect(screen.getByText('Fallback Text')).toBeInTheDocument()
  })

  describe('no fallback prop', () => {
    beforeAll(() => {
      const mockSdk = {
        getVariantText: jest.fn().mockReturnValue(null),
        on: jest.fn(),
      }
      useSDK.mockReturnValue(mockSdk)
      useProjectId.mockReturnValue('1')
    })

    it('returns string children as fallback', () => {
      render(
        <Text id="1" projectId="1">
          Fallback Text
        </Text>
      )
      expect(screen.getByText('Fallback Text')).toBeInTheDocument()
    })

    it('returns empty children as fallback', () => {
      const { asFragment } = render(<Text id="1" projectId="1" />)
      expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <span
          data-xaiku-partid="1"
          data-xaiku-projectid="1"
        />
      </DocumentFragment>
    `)
    })

    it('returns cloned valid element child as fallback', () => {
      render(
        <Text id="1" projectId="1">
          <strong>Fallback Text</strong>
        </Text>
      )
      expect(screen.getByText('Fallback Text')).toBeInTheDocument()
    })

    it('returns render props children as fallback', () => {
      render(
        <Text id="1" projectId="1">
          {emptyString => `Fallback${emptyString}Text`}
        </Text>
      )
      expect(screen.getByText('FallbackText')).toBeInTheDocument()
    })

    it('returns multiple children as fallback', () => {
      render(
        <Text id="1" projectId="1">
          Multiple <span>Original</span> Texts
        </Text>
      )
      expect(screen.getByText(/Multiple/)).toBeInTheDocument()
      expect(screen.getByText(/Original/)).toBeInTheDocument()
      expect(screen.getByText(/Texts/)).toBeInTheDocument()
    })
  })

  describe('sdk return variant text', () => {
    beforeAll(() => {
      const mockSdk = {
        getVariantText: jest.fn().mockReturnValue('Variant Text'),
        on: jest.fn(),
      }
      useSDK.mockReturnValue(mockSdk)
      useProjectId.mockReturnValue('1')
    })

    it('returns variant text when sdk is available', () => {
      render(<Text id="1" projectId="1" fallback="Fallback Text" />)
      expect(screen.getByText('Variant Text')).toBeInTheDocument()
    })

    it('calls children function with text', () => {
      render(
        <Text id="1" projectId="1" fallback="Fallback Text">
          {text => text}
        </Text>
      )
      expect(screen.getByText('Variant Text')).toBeInTheDocument()
    })

    it('clones element with text as children', () => {
      render(
        <Text id="1" projectId="1" fallback="Fallback Text">
          <span>Original Text</span>
        </Text>
      )
      expect(screen.getByText('Variant Text')).toBeInTheDocument()
    })
  })
})
