import React from 'react'
import { render, screen } from '@testing-library/react'
import ProjectProvider, { useProjectId, ProjectContext } from './project'

const TestComponent = () => {
  const projectId = useProjectId()
  return <div>{projectId ? `Project ID: ${projectId}` : 'No Project ID'}</div>
}

describe('ProjectProvider', () => {
  it('provides the project ID to its children', () => {
    render(
      <ProjectProvider projectId="test-project-id">
        <TestComponent />
      </ProjectProvider>
    )
    expect(screen.getByText('Project ID: test-project-id')).toBeInTheDocument()
  })

  it('renders children without a project ID', () => {
    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    )
    expect(screen.getByText('No Project ID')).toBeInTheDocument()
  })
})

describe('ProjectContext', () => {
  it('should have a default value of null', () => {
    expect(ProjectContext._currentValue).toBe(null)
  })
})
