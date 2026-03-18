import React from 'react'
import { render, screen } from '@testing-library/react'
import ExperimentProvider, { useExperimentId, ExperimentContext } from './experiment'

const TestComponent = () => {
  const experimentId = useExperimentId()
  return <div>{experimentId ? `Experiment ID: ${experimentId}` : 'No Experiment ID'}</div>
}

describe('ExperimentProvider', () => {
  it('provides the experiment ID to its children', () => {
    render(
      <ExperimentProvider id="test-experiment-id">
        <TestComponent />
      </ExperimentProvider>
    )
    expect(screen.getByText('Experiment ID: test-experiment-id')).toBeInTheDocument()
  })

  it('renders children without an experiment ID', () => {
    render(
      <ExperimentProvider>
        <TestComponent />
      </ExperimentProvider>
    )
    expect(screen.getByText('No Experiment ID')).toBeInTheDocument()
  })
})

describe('ExperimentContext', () => {
  it('should have a default value of null', () => {
    expect(ExperimentContext._currentValue).toBe(null)
  })
})
